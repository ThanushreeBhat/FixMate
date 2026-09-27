'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import CustomerHeader from '../../components/customer/CustomerHeader';
import WelcomeBanner from '../../components/customer/WelcomeBanner';
import QuickActions from '../../components/customer/QuickActions';
import ActiveBookings from '../../components/customer/ActiveBookings';
import BookingHistory from '../../components/customer/BookingHistory';
import EmergencyBanner from '../../components/customer/EmergencyBanner';
import CustomerFooter from '../../components/customer/CustomerFooter';

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRole="customer">
    <main className="min-h-screen bg-slate-50">
      <CustomerHeader />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <WelcomeBanner />

        <QuickActions />


        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#0A2540]">
              Active Requests
            </h2>

            <p className="text-slate-600 mt-1">
              Track your ongoing repair requests.
            </p>
          </div>

          <ActiveBookings />
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#0A2540]">
              Previous Services
            </h2>

            <p className="text-slate-600 mt-1">
              View your completed service history.
            </p>
          </div>

          <BookingHistory />
        </section>

        <EmergencyBanner />
      </div>

      <CustomerFooter />
    </main>
    </ProtectedRoute>
  );
}
