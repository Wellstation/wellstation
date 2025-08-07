"use client";

interface AgreementCheckboxesProps {
    serviceAgreement: boolean;
    privacyAgreement: boolean;
    onServiceAgreementChange: (checked: boolean) => void;
    onPrivacyAgreementChange: (checked: boolean) => void;
}

export default function AgreementCheckboxes({
    serviceAgreement,
    privacyAgreement,
    onServiceAgreementChange,
    onPrivacyAgreementChange,
}: AgreementCheckboxesProps) {
    const openAgreement = (type: "service" | "privacy") => {
        const urls = {
            service: "/agreements/service",
            privacy: "/agreements/privacy",
        };
        window.open(urls[type], "_blank", "width=800,height=600,scrollbars=yes,resizable=yes");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-start space-x-3">
                <input
                    type="checkbox"
                    id="service-agreement"
                    checked={serviceAgreement}
                    onChange={(e) => onServiceAgreementChange(e.target.checked)}
                    className="mt-1 w-4 h-4 text-gray-600 bg-white/10 border-white/20 rounded focus:ring-gray-500 focus:ring-2"
                />
                <div className="flex-1">
                    <label htmlFor="service-agreement" className="text-white/80 text-sm cursor-pointer">
                        <span className="text-gray-400 font-medium">[필수]</span>{" "}
                        <span
                            className="text-gray-300 hover:text-gray-200 underline cursor-pointer"
                            onClick={() => openAgreement("service")}
                        >
                            서비스 이용 동의
                        </span>
                        에 동의합니다.
                    </label>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <input
                    type="checkbox"
                    id="privacy-agreement"
                    checked={privacyAgreement}
                    onChange={(e) => onPrivacyAgreementChange(e.target.checked)}
                    className="mt-1 w-4 h-4 text-gray-600 bg-white/10 border-white/20 rounded focus:ring-gray-500 focus:ring-2"
                />
                <div className="flex-1">
                    <label htmlFor="privacy-agreement" className="text-white/80 text-sm cursor-pointer">
                        <span className="text-gray-400 font-medium">[필수]</span>{" "}
                        <span
                            className="text-gray-300 hover:text-gray-200 underline cursor-pointer"
                            onClick={() => openAgreement("privacy")}
                        >
                            개인정보 처리 동의
                        </span>
                        에 동의합니다.
                    </label>
                </div>
            </div>
        </div>
    );
} 