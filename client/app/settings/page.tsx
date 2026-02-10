'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

interface User {
  id: number;
  name: string;
  username: string;
  code: string;
  mobile: string | null;
  role: string;
}

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008';
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch current user info from backend
    const fetchUser = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await res.json();
        setUser({
          id: userData.id,
          name: userData.name,
          username: userData.username,
          code: userData.code,
          mobile: userData.mobile,
          role: userData.role,
        });
      } catch (err) {
        setError('Failed to load user info');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordSuccess('');

    // Validate form
    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePasswordError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setChangePasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError('New password and confirm password do not match');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch(`${getApiUrl()}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Failed to change password');
      }

      setChangePasswordSuccess('Password changed successfully!');
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Close form and clear success message after 2 seconds
      setTimeout(() => {
        setChangePasswordSuccess('');
        setShowChangePasswordForm(false);
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to change password';
      setChangePasswordError(errorMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-white text-lg">Loading settings...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
          {error || 'Failed to load settings'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white">Settings</h1>
        </div>

        {/* User Profile Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">User Profile</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Name</p>
              <p className="text-white font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Username</p>
              <p className="text-white font-semibold">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Role</p>
              <p className="text-white capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">User Code</p>
              <p className="text-white font-mono">{user.code}</p>
            </div>
            {user.mobile && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Mobile</p>
                <p className="text-white">{user.mobile}</p>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Button - Only show when form is hidden */}
        {!showChangePasswordForm && (
          <Button 
            onClick={() => setShowChangePasswordForm(true)}
            variant="secondary"
            size="sm"
          >
            Change Password
          </Button>
        )}

        {/* Change Password Section - Only show if user clicked Change Password */}
        {showChangePasswordForm && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Change Password</h2>
              <button
                onClick={() => {
                  setShowChangePasswordForm(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setChangePasswordError('');
                  setChangePasswordSuccess('');
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {changePasswordError && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
                {changePasswordError}
              </div>
            )}

            {changePasswordSuccess && (
              <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4">
                {changePasswordSuccess}
              </div>
            )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your current password"
                required
                disabled={isChangingPassword}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your new password (at least 6 characters)"
                required
                disabled={isChangingPassword}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your new password"
                required
                disabled={isChangingPassword}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowChangePasswordForm(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setChangePasswordError('');
                  setChangePasswordSuccess('');
                }}
                disabled={isChangingPassword}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="flex-1"
              >
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
}
