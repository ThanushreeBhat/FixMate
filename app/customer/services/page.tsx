'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { serviceCategories, ServiceItem } from '../../../data/services';
import { useRouter } from 'next/navigation';

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') || '';
  const emergency = searchParams.get('emergency');
  const services = (category && serviceCategories[category]) ? serviceCategories[category] : [];

  const handleBooking = (service: ServiceItem) => {
    let url = `/customer/bookings/new?category=${encodeURIComponent(
      category
    )}&service=${encodeURIComponent(service.name)}&price=${encodeURIComponent(
      service.price
    )}&duration=${encodeURIComponent(service.duration)}`;

    if (emergency === "true") {
      url += "&emergency=true";
    }

    router.push(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold text-[#0A2540] mb-2">
        {category}
      </h1>

      <p className="text-slate-600 mb-10">
        Choose a service to book.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {services.map((service) => (

          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-xl transition"
          >

            <h2 className="text-xl font-bold text-[#0A2540]">
              {service.name}
            </h2>

            <p className="text-slate-600 mt-3">
              {service.description}
            </p>

            <div className="mt-5 space-y-2">
              <p>
                <span className="font-semibold">Price:</span> ₹{service.price}
              </p>

              <p>
                <span className="font-semibold">Duration:</span>{' '}
                {service.duration}
              </p>
            </div>

            <button
              onClick={() => handleBooking(service)}
              className="mt-6 w-full bg-[#0A2540] text-white py-3 rounded-xl hover:bg-[#16395e]"
            >
              Book Service
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10 text-center font-bold text-slate-500">Loading services catalog...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
