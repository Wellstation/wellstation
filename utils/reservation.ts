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

  // 방문 완료 템플릿
  VISIT_COMPLETED: {
    template: `[방문 완료]
#{name}님의 #{serviceType} 서비스가 완료되었습니다.

서비스 정보:
- 방문일시: #{visitDate}
- 서비스: #{serviceType}
- 차량 정보: #{vehicle}
- 작업 내용: #{workDetails}
- 다음 점검일: #{nextInspectionDate}
- 특이사항: #{notes}`,
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

  // 방문 완료 템플릿
  VISIT_COMPLETED: {
    templateId: "KA01TP250807122029634T15IrB6rq2x",
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
      visitDate: "방문일시",
      workDetails: "작업 내용",
      nextInspectionDate: "다음 점검일",
      notes: "특이사항",
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
  templateType:
    | "RESERVATION_CONFIRMED"
    | "RESERVATION_CANCELLED"
    | "VISIT_COMPLETED",
  variables: Record<string, string>,
  callback?: SMSCallback,
  addText?: string
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
    const smsSuccess = await sendSMS(
      phone,
      smsText + `\n\n${addText}`,
      callback
    );

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
      .update({
        status: "cancelled",
        cancelled_date: new Date().toISOString(),
      })
      .eq("id", reservation.id);

    if (error) {
      console.error("Error cancelling reservation:", error);
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
    console.error("Error cancelling reservation:", error);
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

// 방문 완료 메시지 전송 함수 (카카오톡 우선, 실패 시 SMS)
export const sendVisitCompletionSMS = async (
  reservation: Reservation,
  workDetails: string,
  nextInspectionDate?: string,
  notes?: string,
  callback?: SMSCallback,
  addText?: string
) => {
  try {
    const visitDate = new Date(reservation.reservation_date);
    const formattedVisitDate = visitDate.toLocaleString("ko-KR", {
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
      visitDate: formattedVisitDate,
      vehicle: vehicle,
      workDetails: workDetails,
      nextInspectionDate: nextInspectionDate || "미정",
      notes: notes || "없음",
    };

    // 통합 메시지 전송 (카카오톡 우선, 실패 시 SMS)
    return await sendMessage(
      reservation.phone,
      "VISIT_COMPLETED",
      variables,
      callback,
      addText
    );
  } catch (error) {
    console.error("방문 완료 메시지 전송 중 오류:", error);
    return false;
  }
};

// 방문 완료 처리 함수 (상태 변경 + 메시지 전송)
export const completeVisit = async (
  reservation: Reservation,
  workDetails: string,
  nextInspectionDate?: string,
  notes?: string,
  callback?: SMSCallback,
  onSuccess?: () => void,
  shouldSendSMS?: boolean
) => {
  try {
    // 예약 상태를 'visited'로 변경하고 방문 완료 정보 저장
    const { error } = await supabase
      .from("reservations")
      .update({
        status: "visited",
        visited_date: new Date().toISOString(),
        work_details: workDetails,
        next_inspection_date: nextInspectionDate || null,
        notes: notes || null,
      })
      .eq("id", reservation.id);

    if (error) {
      console.error("Error updating reservation status:", error);
      alert("방문 완료 처리 중 오류가 발생했습니다.");
      return false;
    } else {
      alert("방문 완료 처리되었습니다.");

      // SMS 전송 (shouldSendSMS가 true인 경우에만)
      if (shouldSendSMS) {
        // 방문일시를 한국 시간으로 변환
        const visitDate = new Date(reservation.reservation_date);
        const formattedVisitDate =
          visitDate
            .toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(/\./g, "")
            .replace(/ /g, "T") + ":00";

        await sendVisitCompletionSMS(
          reservation,
          workDetails,
          nextInspectionDate,
          notes,
          callback,
          `피드백 남기기: https://wellstation.app/feedback?name=${encodeURIComponent(
            reservation.name
          )}&phone=${encodeURIComponent(reservation.phone)}&serviceType=${
            reservation.service_type
          }&visitDate=${encodeURIComponent(formattedVisitDate)}`
        );
      }

      if (onSuccess) {
        onSuccess();
      }

      return true;
    }
  } catch (error) {
    console.error("Error completing visit:", error);
    alert("방문 완료 처리 중 오류가 발생했습니다.");
    return false;
  }
};
