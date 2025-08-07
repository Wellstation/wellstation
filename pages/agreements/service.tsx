"use client";

import Head from "next/head";

export default function ServiceAgreement() {
    return (
        <>
            <Head>
                <title>서비스 이용 동의서 - 웰스테이션</title>
                <meta name="description" content="웰스테이션 서비스 이용 동의서" />
            </Head>

            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        서비스 이용 동의서
                    </h1>

                    <div className="prose prose-lg max-w-none">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                            <p className="text-blue-800 font-medium">
                                본 동의서는 웰스테이션(이하 "회사")의 서비스 이용과 관련된 약관입니다.
                            </p>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제1조 (목적)</h2>
                        <p className="text-gray-700 mb-4">
                            본 약관은 웰스테이션이 제공하는 주차, 수리, 튜닝 서비스(이하 "서비스")의 이용과 관련하여
                            회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제2조 (서비스 내용)</h2>
                        <p className="text-gray-700 mb-4">
                            회사는 다음과 같은 서비스를 제공합니다:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4">
                            <li>카라반 및 제트스키&보트 보관 서비스</li>
                            <li>차량 수리 및 정비 서비스</li>
                            <li>차량 튜닝 및 개조 서비스</li>
                            <li>기타 회사가 제공하는 관련 서비스</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제3조 (예약 및 이용)</h2>
                        <p className="text-gray-700 mb-4">
                            1. 서비스 이용은 사전 예약을 통해 이루어집니다.<br />
                            2. 예약은 회사의 예약 시스템을 통해 접수됩니다.<br />
                            3. 예약 변경 및 취소는 서비스 이용 24시간 전까지 가능합니다.<br />
                            4. 예약 시간을 준수하여 주시기 바랍니다.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제4조 (이용자의 의무)</h2>
                        <p className="text-gray-700 mb-4">
                            1. 이용자는 서비스 이용 시 정확한 정보를 제공해야 합니다.<br />
                            2. 이용자는 회사의 시설과 장비를 안전하게 사용해야 합니다.<br />
                            3. 이용자는 다른 이용자에게 불편을 주지 않도록 해야 합니다.<br />
                            4. 이용자는 회사의 안전 규정을 준수해야 합니다.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제5조 (회사의 의무)</h2>
                        <p className="text-gray-700 mb-4">
                            1. 회사는 안전하고 품질 높은 서비스를 제공합니다.<br />
                            2. 회사는 이용자의 개인정보를 보호합니다.<br />
                            3. 회사는 서비스 이용에 필요한 안내를 제공합니다.<br />
                            4. 회사는 시설과 장비의 안전성을 유지합니다.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제6조 (책임 제한)</h2>
                        <p className="text-gray-700 mb-4">
                            1. 천재지변, 전쟁, 테러 등 불가항력적 사유로 인한 서비스 중단에 대해서는 회사가 책임지지 않습니다.<br />
                            2. 이용자의 고의 또는 과실로 인한 손해에 대해서는 회사가 책임지지 않습니다.<br />
                            3. 회사의 고의 또는 중대한 과실로 인한 손해에 대해서는 관련 법령에 따라 책임을 집니다.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제7조 (약관 변경)</h2>
                        <p className="text-gray-700 mb-4">
                            1. 회사는 필요시 본 약관을 변경할 수 있습니다.<br />
                            2. 약관 변경 시 회사는 변경사항을 사전에 공지합니다.<br />
                            3. 이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">제8조 (분쟁 해결)</h2>
                        <p className="text-gray-700 mb-4">
                            1. 서비스 이용과 관련된 분쟁은 당사자 간의 합의로 해결합니다.<br />
                            2. 합의가 이루어지지 않는 경우 관련 법령에 따라 해결합니다.
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