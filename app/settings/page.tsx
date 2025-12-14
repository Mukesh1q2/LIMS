'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedLayout } from '@/components/layout/EnhancedLayout';
import { 
  Cog6ToothIcon, 
  UserCircleIcon, 
  IdentificationIcon, 
  BuildingOfficeIcon,
  BellIcon,
  KeyIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+1 234 567 8900',
    role: user?.role || 'admin',
    timezone: 'IST (UTC+5:30)',
  });

  const [institution, setInstitution] = useState({
    name: 'ABC Institute of Technology',
    code: 'ABCIT',
    address: '123 Education Street, City, State - 123456',
    phone: '+1 234 567 8900',
    email: 'info@abcit.edu',
    website: 'www.abcit.edu',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    feeReminders: true,
    bookReminders: true,
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Check permissions
  const canReadSettings = hasPermission('settings', 'read');
  const canUpdateSettings = hasPermission('settings', 'update');

  // Check if user has permission to access this page
  if (!canReadSettings) {
    return (
      <EnhancedLayout>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cog6ToothIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Access Denied</h2>
            <p className="text-neutral-600 mb-4">
              You don't have permission to access settings.
            </p>
          </div>
        </div>
      </EnhancedLayout>
    );
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the profile
    alert('Profile updated successfully!');
  };

  const handleInstitutionUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the institution settings
    alert('Institution settings updated successfully!');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the password
    if (password.new !== password.confirm) {
      alert('New password and confirm password do not match!');
      return;
    }
    alert('Password updated successfully!');
  };

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <EnhancedLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-600">Manage your account and system settings</p>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="border-b border-neutral-200">
            <nav className="flex -mb-px">
              {[
                { id: 'profile', name: 'Profile', icon: UserCircleIcon },
                { id: 'institution', name: 'Institution', icon: BuildingOfficeIcon },
                { id: 'notifications', name: 'Notifications', icon: BellIcon },
                { id: 'security', name: 'Security', icon: ShieldCheckIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  } group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap`}
                >
                  <tab.icon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">Profile Information</h3>
                  <p className="mt-1 text-sm text-neutral-500">Update your personal profile information.</p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        disabled={!canUpdateSettings}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-neutral-100 disabled:text-neutral-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        disabled={!canUpdateSettings}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-neutral-100 disabled:text-neutral-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        disabled={!canUpdateSettings}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-neutral-100 disabled:text-neutral-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-neutral-700 mb-1">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        value={profile.timezone}
                        onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                        disabled={!canUpdateSettings}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-neutral-100 disabled:text-neutral-500"
                      >
                        <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                        <option value="EST (UTC-5)">EST (UTC-5)</option>
                        <option value="GMT (UTC+0)">GMT (UTC+0)</option>
                        <option value="PST (UTC-8)">PST (UTC-8)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!canUpdateSettings}
                      className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Institution Settings */}
            {activeTab === 'institution' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">Institution Information</h3>
                  <p className="mt-1 text-sm text-neutral-500">Manage your institution's information and settings.</p>
                </div>

                <form onSubmit={handleInstitutionUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="instName" className="block text-sm font-medium text-neutral-700 mb-1">
                        Institution Name
                      </label>
                      <input
                        type="text"
                        id="instName"
                        value={institution.name}
                        onChange={(e) => setInstitution({...institution, name: e.target.value})}
                        disabled={!canUpdateSettings}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-neutral-100 disabled:text-neutral-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="instCode" className="block text-sm font-medium text-neutral-700 mb-1">
                        Institution Code
                      </label>
                      <input
                        type="text"
                        id="instCode"
                        value={institution.code}
                        onChange={(e) => setInstitution({...institution, code: e.target.value})}
                        disabled={!canUpdateSettings}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-neutral-100 disabled:text-neutral-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="instEmail" className="block text-sm font-medium text-neutral-700 mb-1">
                        Institution Email
                      </label>
                      <input
                        type="email"
                        id="instEmail"
                        value={institution.email}
                        onChange={(e) => setInstitution({...institution, email: e.target.value})}
                        disabled={!canUpdateSettings}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-neutral-100 disabled:text-neutral-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="instAddress" className="block text-sm font-medium text-neutral-700 mb-1">
                        Institution Address
                      </label>
                      <textarea
                        id="instAddress"
                        value={institution.address}
                        onChange={(e) => setInstitution({...institution, address: e.target.value})}
                        disabled={!canUpdateSettings}
                        rows={3}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-neutral-100 disabled:text-neutral-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="instPhone" className="block text-sm font-medium text-neutral-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="instPhone"
                        value={institution.phone}
                        onChange={(e) => setInstitution({...institution, phone: e.target.value})}
                        disabled={!canUpdateSettings}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-neutral-100 disabled:text-neutral-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="instWebsite" className="block text-sm font-medium text-neutral-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        id="instWebsite"
                        value={institution.website}
                        onChange={(e) => setInstitution({...institution, website: e.target.value})}
                        disabled={!canUpdateSettings}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-neutral-100 disabled:text-neutral-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!canUpdateSettings}
                      className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Update Institution
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">Notification Settings</h3>
                  <p className="mt-1 text-sm text-neutral-500">Manage how you receive notifications.</p>
                </div>

                <form className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">Email Alerts</h4>
                        <p className="text-sm text-neutral-500">Receive notifications via email</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('emailAlerts')}
                        disabled={!canUpdateSettings}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          notifications.emailAlerts ? 'bg-blue-600' : 'bg-neutral-200'
                        } disabled:opacity-50`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            notifications.emailAlerts ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">SMS Alerts</h4>
                        <p className="text-sm text-neutral-500">Receive notifications via SMS</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('smsAlerts')}
                        disabled={!canUpdateSettings}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          notifications.smsAlerts ? 'bg-blue-600' : 'bg-neutral-200'
                        } disabled:opacity-50`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            notifications.smsAlerts ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">Push Notifications</h4>
                        <p className="text-sm text-neutral-500">Receive notifications in the app</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('pushNotifications')}
                        disabled={!canUpdateSettings}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          notifications.pushNotifications ? 'bg-blue-600' : 'bg-neutral-200'
                        } disabled:opacity-50`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            notifications.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">Fee Payment Reminders</h4>
                        <p className="text-sm text-neutral-500">Get reminded about pending fees</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('feeReminders')}
                        disabled={!canUpdateSettings}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          notifications.feeReminders ? 'bg-blue-600' : 'bg-neutral-200'
                        } disabled:opacity-50`}
                      >
                        <span
                          className={`pointer-events-none inline-flex h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            notifications.feeReminders ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">Library Book Reminders</h4>
                        <p className="text-sm text-neutral-500">Get reminded about overdue books</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('bookReminders')}
                        disabled={!canUpdateSettings}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          notifications.bookReminders ? 'bg-blue-600' : 'bg-neutral-200'
                        } disabled:opacity-50`}
                      >
                        <span
                          className={`pointer-events-none inline-flex h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            notifications.bookReminders ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={!canUpdateSettings}
                      className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">Security Settings</h3>
                  <p className="mt-1 text-sm text-neutral-500">Update your password and security settings.</p>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={password.current}
                        onChange={(e) => setPassword({...password, current: e.target.value})}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={password.new}
                        onChange={(e) => setPassword({...password, new: e.target.value})}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={password.confirm}
                        onChange={(e) => setPassword({...password, confirm: e.target.value})}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn-primary px-6 py-2"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                <div className="pt-6 border-t border-neutral-200">
                  <h3 className="text-lg font-medium text-neutral-900">Two-Factor Authentication</h3>
                  <p className="mt-1 text-sm text-neutral-500">Add an extra layer of security to your account.</p>
                  <div className="mt-4 flex items-center">
                    <button className="mr-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Enable 2FA
                    </button>
                    <p className="text-sm text-neutral-500">Currently disabled</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </EnhancedLayout>
  );
}