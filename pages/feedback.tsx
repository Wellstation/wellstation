'use client';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { SERVICE_TYPE_LABELS, ServiceType } from '../types/enums';

interface FeedbackForm {
  service_type: ServiceType;
  name: string;
  contact: string;
  content: string;
  rating: number | null;
  visit_date: string;
}

export default function Feedback() {
  const router = useRouter();
  const [formData, setFormData] = useState<FeedbackForm>({
    service_type: ServiceType.REPAIR,
    name: '',
    contact: '',
    content: '',
    rating: null,
    visit_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // URL 파라미터에서 폼 데이터 자동 채우기
  useEffect(() => {
    if (router.isReady) {
      const { name, phone, serviceType, visitDate } = router.query;

      if (name || phone || serviceType || visitDate) {
        setFormData(prev => ({
          ...prev,
          name: typeof name === 'string' ? decodeURIComponent(name) : prev.name,
          contact: typeof phone === 'string' ? decodeURIComponent(phone) : prev.contact,
          service_type: typeof serviceType === 'string' && Object.values(ServiceType).includes(serviceType as ServiceType)
            ? serviceType as ServiceType
            : prev.service_type,
          visit_date: typeof visitDate === 'string' ? decodeURIComponent(visitDate) : prev.visit_date
        }));
      }
    }
  }, [router.isReady, router.query]);

  const serviceTypeOptions = [
    { value: ServiceType.REPAIR, label: SERVICE_TYPE_LABELS[ServiceType.REPAIR] },
    { value: ServiceType.TUNING, label: SERVICE_TYPE_LABELS[ServiceType.TUNING] },
    { value: ServiceType.PARKING, label: SERVICE_TYPE_LABELS[ServiceType.PARKING] }
  ];

  const handleInputChange = (field: keyof FeedbackForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceTypeChange = (serviceType: ServiceType) => {
    setFormData(prev => ({
      ...prev,
      service_type: serviceType
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating: rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
        setFormData({
          service_type: ServiceType.REPAIR,
          name: '',
          contact: '',
          content: '',
          rating: null,
          visit_date: ''
        });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '서버 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };





  return (
    <>
      <Head>
        <title>피드백 - 웰스테이션</title>
        <meta name="description" content="웰스테이션 서비스에 대한 피드백을 남겨주세요. 정비, 튜닝, 주차 서비스에 대한 의견을 들려주세요." />
      </Head>

      <div className="min-h-screen bg-main-background bg-cover bg-center bg-fixed">
        {/* Header */}
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-6">
            <Link href="/" className="inline-flex items-center text-white hover:text-blue-300 transition-colors duration-300">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              홈으로 돌아가기
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Feedback Form */}
            <div className="glass rounded-3xl p-8 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  <span className="gradient-text">피드백</span>
                </h1>
                <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                  웰스테이션 서비스에 대한 소중한 의견을 들려주세요.<br />
                  더 나은 서비스를 위해 여러분의 피드백이 필요합니다.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Type Field */}
                <div>
                  <label htmlFor="service_type" className="block text-white font-semibold mb-2">
                    서비스 타입 *
                  </label>
                  <select
                    id="service_type"
                    value={formData.service_type}
                    onChange={(e) => handleServiceTypeChange(e.target.value as ServiceType)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    required
                  >
                    {serviceTypeOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-white font-semibold mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder="이름을 입력해주세요"
                    required
                  />
                </div>

                {/* Rating Field */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    별점
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className={`text-2xl transition-all duration-200 hover:scale-110 ${formData.rating && star <= formData.rating
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                          }`}
                      >
                        ★
                      </button>
                    ))}
                    {formData.rating && (
                      <span className="text-white text-sm ml-2">
                        ({formData.rating}/5)
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Field */}
                <div>
                  <label htmlFor="contact" className="block text-white font-semibold mb-2">
                    연락처 *
                  </label>
                  <input
                    type="text"
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder="전화번호 또는 이메일을 입력해주세요"
                    required
                  />
                </div>

                {/* Visit Date Field */}
                <div>
                  <label htmlFor="visit_date" className="block text-white font-semibold mb-2">
                    방문일시
                  </label>
                  <input
                    type="datetime-local"
                    id="visit_date"
                    value={formData.visit_date}
                    onChange={(e) => handleInputChange('visit_date', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Content Field */}
                <div>
                  <label htmlFor="content" className="block text-white font-semibold mb-2">
                    피드백 내용 *
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="서비스에 대한 의견이나 개선사항을 자유롭게 작성해주세요 (최소 10자, 최대 1000자)"
                    required
                    maxLength={1000}
                  />
                  <div className="text-right text-sm text-white/60 mt-1">
                    {formData.content.length}/1000
                  </div>
                </div>

                {/* Message Display */}
                {message && (
                  <div className={`p-4 rounded-xl ${message.type === 'success'
                    ? 'bg-green-500/20 border border-green-400/30 text-green-300'
                    : 'bg-red-500/20 border border-red-400/30 text-red-300'
                    }`}>
                    {message.text}
                  </div>
                )}

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="glass rounded-full px-8 py-4 text-white font-semibold border border-white/30 btn-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        제출 중...
                      </div>
                    ) : (
                      '피드백 제출하기'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center text-white/60 text-sm">
              <p>
                피드백은 서비스 개선을 위해 활용됩니다.<br />
                개인정보는 안전하게 보호되며, 서비스 개선 목적으로만 사용됩니다.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
