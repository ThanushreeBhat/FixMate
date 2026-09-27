'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import TrustSection from '../components/TrustSection';
import EmergencySection from '../components/EmergencySection';
import AboutSection from '../components/AboutSection';
import PortalSection from '../components/PortalSection';
import MetricsSection from '../components/MetricsSection';
import Footer from '../components/Footer';

import BookingModal from '../components/BookingModal';
import EmergencyModal from '../components/EmergencyModal';
import AuthModal from '../components/AuthModal';

import { logoutUser } from '../lib/firebase/auth';
import type { Service } from '../lib/types';

import { Info } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({
    isOpen: false,
    mode: 'login',
  });

  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    service: Service | null;
  }>({
    isOpen: false,
    service: null,
  });

  const [emergencyModal, setEmergencyModal] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      setCurrentUser(null);

      showToast('Signed out successfully.');

      router.push('/');
    } catch (error: any) {
      showToast(error.message);
    }
  };

 const handleAuthSuccess = (user: User, role: string, authMode: string) => {
  setCurrentUser(user);

  if (authMode === 'signup') {
    switch (role) {
      case 'customer':
        router.push('/customer/profile');
        return;

      case 'technician':
        router.push('/technician/profile');
        return;
    }
  }

  switch (role) {
    case 'customer':
      router.push('/customer');
      break;

    case 'technician':
      router.push('/technician');
      break;

    case 'dispatcher':
      router.push('/dispatcher');
      break;

    case 'admin':
      router.push('/admin');
      break;

    default:
      router.push('/');
  }
};

  const openLoginModal = () => setAuthModal({ isOpen: true, mode: 'login' });

  return (
    <main className="min-h-screen flex flex-col font-sans bg-mintCream">

      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={(mode) =>
          setAuthModal({
            isOpen: true,
            mode: mode === 'signup' ? 'signup' : 'login',
          })
        }
      />

      <HeroSection
        onBookService={() =>
          currentUser 
            ? setBookingModal({ isOpen: true, service: null }) 
            : openLoginModal()
        }
      />

      <ServicesSection
        onSelectService={(service) =>
          currentUser 
            ? setBookingModal({ isOpen: true, service }) 
            : openLoginModal()
        }
      />

      <HowItWorksSection
        onBookService={() =>
          currentUser 
            ? setBookingModal({ isOpen: true, service: null }) 
            : openLoginModal()
        }
      />

      <TrustSection />

      <EmergencySection
        onOpenEmergency={() => setEmergencyModal(true)}
      />

      <AboutSection />

      <PortalSection />

      <MetricsSection />

      <Footer
        onShowToast={showToast}
      />

      {/* Booking Modal */}

      <BookingModal
        isOpen={bookingModal.isOpen}
        selectedService={bookingModal.service}
        onClose={() =>
          setBookingModal({
            isOpen: false,
            service: null,
          })
        }
        onShowToast={showToast}
      />

      {/* Emergency Modal */}

      <EmergencyModal
        isOpen={emergencyModal}
        onClose={() => setEmergencyModal(false)}
        onShowToast={showToast}
      />

      {/* Authentication Modal */}

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() =>
          setAuthModal({
            isOpen: false,
            mode: 'login',
          })
        }
        onAuthSuccess={handleAuthSuccess}
        onShowToast={showToast}
      />

      {/* Toast */}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[3000] bg-[#134074] text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-bottom duration-300">
          <Info className="w-5 h-5 text-powderBlue" />
          <span>{toastMessage}</span>
        </div>
      )}

    </main>
  );
}
