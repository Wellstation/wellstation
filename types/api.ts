// SMS API 응답 타입 정의
export interface SMSResult {
  groupId: string;
  to: string;
  from: string;
  type: string;
  statusMessage: string;
  country: string;
  messageId: string;
  statusCode: string;
  accountId: string;
}

export interface SMSResponse {
  message: string;
  result: SMSResult;
}

export interface SMSErrorResponse {
  message: string;
  error?: any;
}
