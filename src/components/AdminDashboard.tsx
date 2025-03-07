import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Code2,
  LogOut,
  Settings as SettingsIcon,
  User,
  Contact
} from 'lucide-react';
import BlogManager from './admin/BlogManager';
import PortfolioManager from './admin/PortfolioManager';
import ExperienceManager from './admin/ExperienceManager';
import DashboardOverview from './admin/DashboardOverview';
import ProfileManager from './admin/ProfileManager';
import ContactManager from './admin/ContactManager';
import SkillsManager from './admin/SkillsManager';

const SettingsPanel = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Settings</h2>
    {/* Add settings content */}
  </div>
);

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <Link
            to="/admin/dashboard"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/admin/blog"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <FileText className="h-5 w-5 mr-3" />
            Blog Posts
          </Link>
          <Link
            to="/admin/portfolio"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Code2 className="h-5 w-5 mr-3" />
            Portfolio
          </Link>
          <Link
            to="/admin/experience"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Briefcase className="h-5 w-5 mr-3" />
            Experience
          </Link>
          <Link
            to="/admin/profile"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <User className="h-5 w-5 mr-3" />
            Profile Section
          </Link>
          <Link
            to="/admin/contact"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Contact className="h-5 w-5 mr-3" />
            Contact Info
          </Link>
          <Link
            to="/admin/skills"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Code2 className="h-5 w-5 mr-3" />
            Skills
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <SettingsIcon className="h-5 w-5 mr-3" />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="blog/*" element={<BlogManager />} />
            <Route path="portfolio/*" element={<PortfolioManager />} />
            <Route path="experience/*" element={<ExperienceManager />} />
            <Route path="profile" element={<ProfileManager />} />
            <Route path="contact" element={<ContactManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="settings" element={<SettingsPanel />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;