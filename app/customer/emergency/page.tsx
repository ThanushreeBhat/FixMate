'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export default function EmergencyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertTriangle
          size={60}
          className="mx-auto text-red-600 mb-4"
        />

        <h1 className="text-3xl font-bold text-red-600">
          Emergency Service
        </h1>

        <p className="mt-4 text-gray-600">
          Need immediate assistance? Your emergency request will be given
          the highest priority and sent directly to the dispatcher.
        </p>

        <button
          onClick={() => router.push('/customer/servlist?emergency=true')}
          className="mt-8 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
        >
          Book Emergency Service
        </button>

        <button
          onClick={() => router.back()}
          className="mt-4 block w-full border border-gray-300 py-3 rounded-xl hover:bg-gray-100"
        >
          Go Back
        </button>
      </div>
    </main>
  );
}
