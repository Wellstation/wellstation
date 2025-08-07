'use client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function EditWorkRecordPage() {
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id && typeof id === 'string') {
            // new.tsx로 리다이렉트하면서 id 파라미터를 전달
            router.replace(`/admin/work-records/new?id=${id}`);
        }
    }, [id, router]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-xl text-white">리다이렉트 중...</div>
        </div>
    );
} 