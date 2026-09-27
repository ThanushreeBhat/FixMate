'use client';

import { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../lib/firebase/auth';
import {
  createUserDocument,
  getUserDocument,
} from '../lib/firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  mode?: string;
  onClose: () => void;
  onAuthSuccess: (user: any, role: string, type: 'login' | 'signup') => void;
  onShowToast: (message: string) => void;
}

export default function AuthModal({
  isOpen,
  mode,
  onClose,
  onAuthSuccess,
  onShowToast,
}: AuthModalProps) {
  const [authMode, setAuthMode] = useState(mode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthMode(mode || 'login');
  }, [mode]);

  if (!isOpen) return null;

  const resetForm = () => {
  setEmail('');
  setPassword('');
  setRole('customer');
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (authMode === 'login') {
      const res = await loginUser(email, password);

      const userData = await getUserDocument(res.user.uid);

      if (!userData) {
        throw new Error('User record not found.');
      }

      onAuthSuccess(res.user, userData.role, 'login');

      onShowToast(`Welcome ${userData.role}!`);
    } else {
      const res = await registerUser(email, password);

      await createUserDocument(res.user.uid, {
        uid: res.user.uid,
        email: res.user.email,
        role,
        createdAt: new Date(),
        name: '',
        age: '',
        gender: '',
        mobile: '',
        address: '',
        experience: '',
        skills: [],
      });

      onAuthSuccess(res.user, role, 'signup');

      onShowToast(
        `Account created successfully as ${role}!`
      );
    }

    resetForm();
    onClose();
  } catch (err: any) {
    onShowToast(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden">


        <div className="bg-slate-50 px-7 py-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-[#0A2540]">
            {authMode === 'login'
              ? 'FixMate Secure Login'
              : 'Create FixMate Account'}
          </h3>

          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-[#0A2540]"
          >
            &times;
          </button>
        </div>


        <form
          onSubmit={handleSubmit}
          className="p-7 space-y-4"
        >

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="user@example.com"
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Register As
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="w-full p-3 rounded-lg border border-slate-300 text-sm"
              >
                <option value="customer">
                  Customer
                </option>

                <option value="technician">
                  Technician
                </option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A2540] hover:bg-[#13395F] text-white font-bold py-3.5 rounded-lg transition-colors"
          >
            {loading
              ? 'Processing...'
              : authMode === 'login'
              ? 'Login'
              : 'Create Account'}
          </button>

          <div className="text-center pt-2">
            {authMode === 'login' ? (
              <p className="text-xs text-slate-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() =>
                    setAuthMode('signup')
                  }
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() =>
                    setAuthMode('login')
                  }
                  className="font-bold text-blue-600 hover:underline"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}