import { supabase } from "@/supabase/client";
import { Reservation } from "@/types/api";
import { getServiceTypeLabel } from "@/types/enums";

export interface SMSCallback {
  setSmsStatus: (status: "pending" | "success" | "failed" | null) => void;
}

// SMS 템플릿 관리
export const SMS_TEMPLATES = {
  // 예약 완료 템플릿
  RESERVATION_CONFIRMED: {
    template: `[#{serviceType}예약]
이름: #{name}
연락처: #{phone}
차량 정보: #{vehicle}
예약 일시: #{reservationDate}
요청 사항: #{request}
기타 사항: #{etc}`,
  },

  // 예약 취소 템플릿
  RESERVATION_CANCELLED: {
    template: `[예약 취소]
#{name}님의 #{serviceType} 예약이 취소되었습니다.

예약 정보:
- 예약일시: #{reservationDate}
- 서비스: #{serviceType}
- 차량 정보: #{vehicle}
- 취소 사유: #{reason}`,
  },
};

// 카카오톡 템플릿 관리
export const KAKAO_TEMPLATES = {
  // 예약 완료 템플릿
  RESERVATION_CONFIRMED: {
    templateId: "KA01TP250806081929279hEGIk1cKimp",
  },

  // 예약 취소 템플릿
  RESERVATION_CANCELLED: {
    templateId: "KA01TP250806082222102pAuAlZ6Abyt",
  },
};

// 템플릿 변수 치환 함수
export const replaceTemplateVariables = (
  template: string,
  variables: Record<string, string>
) => {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`#\\{${key}\\}`, "g"), value || "-");
  });
  return result;
};

// 템플릿 관리 함수들
export const templateHelpers = {
  // 템플릿 가져오기
  getTemplate(type: keyof typeof SMS_TEMPLATES) {
    return SMS_TEMPLATES[type];
  },

  // 템플릿 업데이트 (런타임에서만)
  updateTemplate(type: keyof typeof SMS_TEMPLATES, newTemplate: string) {
    if (SMS_TEMPLATES[type]) {
      SMS_TEMPLATES[type].template = newTemplate;
    }
  },

  // 사용 가능한 변수 목록 가져오기
  getAvailableVariables() {
    return {
      name: "고객명",
      phone: "연락처",
      serviceType: "서비스 타입",
      reservationDate: "예약일시",
      vehicle: "차량 정보",
      request: "요청사항",
      reason: "취소 사유",
      etc: "기타 사항",
    };
  },

  // 템플릿 미리보기
  previewTemplate(
    type: keyof typeof SMS_TEMPLATES,
    variables: Record<string, string>
  ) {
    const template = SMS_TEMPLATES[type];
    if (!template) return null;

    return replaceTemplateVariables(template.template, variables);
  },
};

export const sendSMS = async (
  phone: string,
  text: string,
  callback?: SMSCallback
) => {
  try {
    if (callback) callback.setSmsStatus("pending");

    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phone, text }),
    });

    const data = await res.json();
    if (res.ok) {
      if (callback) callback.setSmsStatus("success");
      return true;
    } else {
      if (callback) callback.setSmsStatus("failed");
      console.warn("SMS 전송 실패:", data);
      return false;
    }
  } catch (error) {
    if (callback) callback.setSmsStatus("failed");
    console.error("SMS 전송 중 오류:", error);
    return false;
  }
};

// 카카오톡 변수를 SOLAPI 형식으로 변환하는 함수
export const formatKakaoVariables = (variables: Record<string, string>) => {
  const formattedVariables: Record<string, string> = {};

  Object.entries(variables).forEach(([key, value]) => {
    formattedVariables[`#{${key}}`] = value;
  });

  return formattedVariables;
};

// 카카오톡 메시지 전송 함수
export const sendKakaoMessage = async (
  phone: string,
  templateId: string,
  variables: Record<string, string>,
  callback?: SMSCallback
) => {
  try {
    if (callback) callback.setSmsStatus("pending");

    // 변수를 SOLAPI 형식으로 변환
    const formattedVariables = formatKakaoVariables(variables);

    const res = await fetch("/api/send-kakao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: phone,
        templateId,
        variables: formattedVariables,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      if (callback) callback.setSmsStatus("success");
      return true;
    } else {
      if (callback) callback.setSmsStatus("failed");
      console.warn("카카오톡 전송 실패:", data);
      return false;
    }
  } catch (error) {
    if (callback) callback.setSmsStatus("failed");
    console.error("카카오톡 전송 중 오류:", error);
    return false;
  }
};

// 통합 메시지 전송 함수 (카카오톡 우선, 실패 시 SMS)
export const sendMessage = async (
  phone: string,
  templateType: "RESERVATION_CONFIRMED" | "RESERVATION_CANCELLED",
  variables: Record<string, string>,
  callback?: SMSCallback
) => {
  try {
    // 카카오톡 템플릿 정보 가져오기
    const kakaoTemplate = KAKAO_TEMPLATES[templateType];
    const smsTemplate = SMS_TEMPLATES[templateType];

    // 먼저 카카오톡으로 전송 시도
    const kakaoSuccess = await sendKakaoMessage(
      phone,
      kakaoTemplate.templateId,
      variables,
      callback
    );

    if (kakaoSuccess) {
      console.log("카카오톡 전송 성공");
      return true;
    }

    // 카카오톡 전송 실패 시 SMS로 전송
    console.log("카카오톡 전송 실패, SMS로 전송 시도");
    const smsText = replaceTemplateVariables(smsTemplate.template, variables);
    const smsSuccess = await sendSMS(phone, smsText, callback);

    if (smsSuccess) {
      console.log("SMS 전송 성공");
      return true;
    } else {
      console.error("카카오톡과 SMS 모두 전송 실패");
      return false;
    }
  } catch (error) {
    console.error("메시지 전송 중 오류:", error);
    if (callback) callback.setSmsStatus("failed");
    return false;
  }
};

export const cancelReservation = async (
  reservation: Reservation,
  callback?: SMSCallback,
  onSuccess?: () => void,
  reason?: string,
  shouldSendSMS?: boolean
) => {
  try {
    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", reservation.id);

    if (error) {
      console.error("Error deleting reservation:", error);
      alert("예약 취소 중 오류가 발생했습니다.");
      return false;
    } else {
      alert("예약이 취소되었습니다.");

      // SMS 전송 (shouldSendSMS가 true인 경우에만)
      if (shouldSendSMS) {
        const reservationDate = new Date(reservation.reservation_date);
        const formattedDate = reservationDate.toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          weekday: "long",
        });

        const serviceTypeLabel = getServiceTypeLabel(reservation.service_type);

        // 차량 정보 구성
        const vehicle =
          reservation.service_type === "parking"
            ? reservation.vehicle_info || "-"
            : `${reservation.model || "-"}${
                reservation.vin ? ` (${reservation.vin})` : ""
              }`;

        const variables = {
          name: reservation.name,
          phone: reservation.phone,
          serviceType: serviceTypeLabel,
          reservationDate: formattedDate,
          vehicle: vehicle,
          reason: reason || "고객 요청",
        };

        // 통합 메시지 전송 (카카오톡 우선, 실패 시 SMS)
        sendMessage(
          reservation.phone,
          "RESERVATION_CANCELLED",
          variables,
          callback
        );
      }

      if (onSuccess) {
        onSuccess();
      }

      return true;
    }
  } catch (error) {
    console.error("Error deleting reservation:", error);
    alert("예약 취소 중 오류가 발생했습니다.");
    return false;
  }
};

// 예약 완료 메시지 전송 함수 (카카오톡 우선, 실패 시 SMS)
export const sendReservationConfirmationSMS = async (
  reservation: Reservation,
  callback?: SMSCallback
) => {
  try {
    const reservationDate = new Date(reservation.reservation_date);
    const formattedDate = reservationDate.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    });

    const serviceTypeLabel = getServiceTypeLabel(reservation.service_type);

    // 차량 정보 구성
    const vehicle =
      reservation.service_type === "parking"
        ? reservation.vehicle_info || "-"
        : `${reservation.model || "-"}${
            reservation.vin ? ` (${reservation.vin})` : ""
          }`;

    const variables = {
      name: reservation.name,
      phone: reservation.phone,
      serviceType: serviceTypeLabel,
      reservationDate: formattedDate,
      vehicle: vehicle,
      request: reservation.request || "없음",
      etc: reservation.etc || "없음",
    };

    // 통합 메시지 전송 (카카오톡 우선, 실패 시 SMS)
    return await sendMessage(
      reservation.phone,
      "RESERVATION_CONFIRMED",
      variables,
      callback
    );
  } catch (error) {
    console.error("예약 완료 메시지 전송 중 오류:", error);
    return false;
  }
};
