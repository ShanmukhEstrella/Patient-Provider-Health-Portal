import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, UserProfile } from '../../lib/supabase';
import { Save } from 'lucide-react';

export function ProfileForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    full_name: '',
    date_of_birth: '',
    phone: '',
    address: '',
    emergency_contact: '',
    blood_type: '',
    allergies: '',
    medical_conditions: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  async function loadProfile() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user!.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field: keyof UserProfile, value: string) {
    setProfile({ ...profile, [field]: value });
  }

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            id="full_name"
            type="text"
            value={profile.full_name || ''}
            onChange={(e) => handleChange('full_name', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            id="date_of_birth"
            type="date"
            value={profile.date_of_birth || ''}
            onChange={(e) => handleChange('date_of_birth', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={profile.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700 mb-1">
            Blood Type
          </label>
          <select
            id="blood_type"
            value={profile.blood_type || ''}
            onChange={(e) => handleChange('blood_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Select...</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={profile.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact
          </label>
          <input
            id="emergency_contact"
            type="text"
            value={profile.emergency_contact || ''}
            onChange={(e) => handleChange('emergency_contact', e.target.value)}
            placeholder="Name and phone number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
            Allergies
          </label>
          <textarea
            id="allergies"
            value={profile.allergies || ''}
            onChange={(e) => handleChange('allergies', e.target.value)}
            rows={3}
            placeholder="List any known allergies"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-700 mb-1">
            Medical Conditions
          </label>
          <textarea
            id="medical_conditions"
            value={profile.medical_conditions || ''}
            onChange={(e) => handleChange('medical_conditions', e.target.value)}
            rows={3}
            placeholder="List any chronic conditions or ongoing treatments"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('success')
            ? 'bg-green-50 text-green-600'
            : 'bg-red-50 text-red-600'
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 bg-teal-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
