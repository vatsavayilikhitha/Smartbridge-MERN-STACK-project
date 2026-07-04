import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
      country: user?.address?.country || 'India',
    },
  });

  const [passForm, setPassForm] = useState({ password: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', profileForm);
      updateUser(data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passForm.password !== passForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await api.put('/users/profile', { password: passForm.password });
      toast.success('Password updated!');
      setPassForm({ password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--burgundy-900)', padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
            <div style={{
              width: 72, height: 72,
              background: 'var(--burgundy-600)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--cream)',
              border: '3px solid var(--burgundy-400)',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)', marginBottom: 4 }}>{user?.name}</h1>
              <p style={{ color: 'var(--beige-500)' }}>{user?.email}</p>
              <span className="badge" style={{ background: user?.role === 'admin' ? 'var(--burgundy-500)' : 'var(--burgundy-700)', color: 'var(--cream)', marginTop: 6 }}>
                {user?.role === 'admin' ? '👑 Admin' : '🛍️ Customer'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>

          {/* Sidebar Navigation */}
          <div className="sidebar" style={{ position: 'sticky', top: 90 }}>
            {[
              { id: 'profile', label: 'Profile Info', icon: <FiUser /> },
              { id: 'address', label: 'Address', icon: <FiMapPin /> },
              { id: 'password', label: 'Change Password', icon: <FiLock /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? 700 : 400,
                  background: activeTab === tab.id ? 'var(--burgundy-100)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  transition: 'all var(--transition-fast)',
                  marginBottom: 'var(--space-1)',
                }}
                id={`profile-tab-${tab.id}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {/* Profile Info */}
            {activeTab === 'profile' && (
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FiUser color="var(--primary)" /> Personal Information
                  </h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-input"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        id="profile-name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        className="form-input"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        id="profile-email"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-input"
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        id="profile-phone"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving} id="save-profile-btn" style={{ alignSelf: 'flex-start' }}>
                      <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Address */}
            {activeTab === 'address' && (
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FiMapPin color="var(--primary)" /> Delivery Address
                  </h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    <div className="form-group">
                      <label className="form-label">Street Address</label>
                      <input
                        className="form-input"
                        value={profileForm.address.street}
                        onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, street: e.target.value } })}
                        placeholder="Flat / House No., Street Name"
                        id="profile-street"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input className="form-input" value={profileForm.address.city} onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, city: e.target.value } })} id="profile-city" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input className="form-input" value={profileForm.address.state} onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, state: e.target.value } })} id="profile-state" />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label">Pincode</label>
                        <input className="form-input" value={profileForm.address.pincode} onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, pincode: e.target.value } })} maxLength={6} id="profile-pincode" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input className="form-input" value={profileForm.address.country} disabled style={{ background: 'var(--beige-300)', cursor: 'not-allowed' }} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving} id="save-address-btn" style={{ alignSelf: 'flex-start' }}>
                      <FiSave /> {saving ? 'Saving...' : 'Save Address'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Password */}
            {activeTab === 'password' && (
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FiLock color="var(--primary)" /> Change Password
                  </h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 400 }}>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        className="form-input"
                        type="password"
                        value={passForm.password}
                        onChange={(e) => setPassForm({ ...passForm, password: e.target.value })}
                        placeholder="Min. 6 characters"
                        required
                        id="profile-new-password"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        className="form-input"
                        type="password"
                        value={passForm.confirmPassword}
                        onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                        placeholder="Re-enter new password"
                        required
                        id="profile-confirm-password"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving} id="save-password-btn" style={{ alignSelf: 'flex-start' }}>
                      <FiLock /> {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
