import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Target, BookOpen, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { ProfileForm } from '../Profile/ProfileForm';
import { GoalTracker } from '../Goals/GoalTracker';
import { HealthInfoPage } from '../HealthInfo/HealthInfoPage';

type View = 'health-info' | 'goals' | 'profile';

export function Dashboard() {
  const { user, userRole, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('health-info');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'health-info' as View, label: 'Health Info', icon: BookOpen },
    { id: 'goals' as View, label: 'My Goals', icon: Target },
    { id: 'profile' as View, label: 'Profile', icon: UserIcon },
  ];

  function handleSignOut() {
    signOut();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HCLTech Healthcare</h1>
                <p className="text-xs text-gray-500">Wellness Portal</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <nav className="px-4 py-2">
              {navigationItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      currentView === item.id
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="px-4 py-3 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border border-gray-200 p-2 sticky top-24">
              {navigationItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentView === item.id
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {currentView === 'health-info' && <HealthInfoPage />}
              {currentView === 'goals' && <GoalTracker />}
              {currentView === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
                  <ProfileForm />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
