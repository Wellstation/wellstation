// 방문자 ID 생성 및 관리
export function generateVisitorId(): string {
  // 로컬 스토리지에서 기존 방문자 ID 확인
  if (typeof window !== "undefined") {
    const existingId = localStorage.getItem("visitor_id");
    if (existingId) {
      return existingId;
    }
  }

  // 새로운 방문자 ID 생성
  const newId =
    "visitor_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();

  // 로컬 스토리지에 저장
  if (typeof window !== "undefined") {
    localStorage.setItem("visitor_id", newId);
  }

  return newId;
}

// 방문자 ID 가져오기
export function getVisitorId(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("visitor_id") || generateVisitorId();
  }
  return "anonymous";
}
