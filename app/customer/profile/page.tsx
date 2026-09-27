'use client';

import ProtectedRoute from '../../../components/ProtectedRoute';
import CustomerProfileForm from '../../../components/customer/CustomerProfileForm';

export default function CustomerProfilePage() {
  return (
    <ProtectedRoute allowedRole="customer">
      <CustomerProfileForm />
    </ProtectedRoute>
  );
}
