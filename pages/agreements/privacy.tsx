"use client";

import Head from "next/head";

export default function PrivacyAgreement() {
    return (
        <>
            <Head>
                <title>개인정보 처리 동의서 - 웰스테이션</title>
                <meta name="description" content="웰스테이션 개인정보 처리 동의서" />
            </Head>

            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        개인정보 처리 동의서
                    </h1>

                    <div className="prose prose-lg max-w-none">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                            <p className="text-blue-800 font-medium">
                                웰스테이션(이하 "회사")은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고
                                개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
                            </p>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. 개인정보의 처리 목적</h2>
                        <p className="text-gray-700 mb-4">
                            회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는
                            이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등
                            필요한 조치를 이행할 예정입니다.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>서비스 예약 및 제공</li>
                            <li>고객 상담 및 문의 응대</li>
                            <li>서비스 개선 및 신규 서비스 개발</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. 개인정보의 처리 및 보유기간</h2>
                        <p className="text-gray-700 mb-4">
                            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은
                            개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>서비스 이용 관련 개인정보: 서비스 이용 종료 후 3년</li>
                            <li>고객 상담 관련 개인정보: 상담 완료 후 2년</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. 개인정보의 제3자 제공</h2>
                        <p className="text-gray-700 mb-4">
                            회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며,
                            정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만
                            개인정보를 제3자에게 제공합니다.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. 개인정보처리의 위탁</h2>
                        <p className="text-gray-700 mb-4">
                            회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>위탁받는 자 (수탁자): Supabase, AWS</li>
                            <li>위탁하는 업무의 내용: 개인정보 저장 및 관리</li>
                            <li>위탁기간: 서비스 제공 기간</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. 정보주체의 권리·의무 및 그 행사방법</h2>
                        <p className="text-gray-700 mb-4">
                            이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>개인정보 열람요구</li>
                            <li>오류 등이 있을 경우 정정 요구</li>
                            <li>삭제요구</li>
                            <li>처리정지 요구</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. 처리하는 개인정보의 항목</h2>
                        <p className="text-gray-700 mb-4">
                            회사는 다음의 개인정보 항목을 처리하고 있습니다.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>필수항목: 이름, 연락처, 차량정보</li>
                            <li>선택항목: 차량모델, VIN, 요청사항, 기타 요청사항</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. 개인정보의 파기</h2>
                        <p className="text-gray-700 mb-4">
                            회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
                            지체없이 해당 개인정보를 파기합니다.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>전자적 파일 형태의 정보: 복구 불가능한 방법으로 영구 삭제</li>
                            <li>종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. 개인정보의 안전성 확보 조치</h2>
                        <p className="text-gray-700 mb-4">
                            회사는 개인정보보호법 제29조에 따라 다음과 같은 안전성 확보 조치를 취하고 있습니다.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>개인정보의 암호화</li>
                            <li>해킹 등에 대비한 기술적 대책</li>
                            <li>개인정보에 대한 접근 제한</li>
                            <li>개인정보 취급 직원의 최소화 및 교육</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. 개인정보 보호책임자</h2>
                        <p className="text-gray-700 mb-4">
                            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의
                            불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-gray-700">
                                <strong>개인정보 보호책임자</strong><br />
                                성명: 박경남<br />
                                연락처: 010-5183-0000<br />
                                이메일: apsauto@naver.com
                            </p>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. 개인정보 처리방침 변경</h2>
                        <p className="text-gray-700 mb-4">
                            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가,
                            삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                        </p>

                        <div className="bg-gray-50 p-6 rounded-lg mt-8">
                            <p className="text-gray-700 text-sm">
                                <strong>시행일자:</strong> 2025년 8월 6일<br />
                                <strong>최종 수정일:</strong> 2025년 8월 6일
                            </p>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => window.close()}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                창 닫기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 