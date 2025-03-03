import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { ProfileData } from '../../types';

const ProfileManager = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    jobTitle: '',
    introduction: '',
    photoURL: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'profileContent', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data() as ProfileData);
        }
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchData();
  }, []);

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'profile');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      let photoURL = profileData.photoURL;
      
      if (photoFile) {
        photoURL = await uploadImageToCloudinary(photoFile);
      }

      await setDoc(doc(db, 'profileContent', 'main'), {
        ...profileData,
        photoURL
      });

      setProfileData(prev => ({ ...prev, photoURL }));
      setPhotoFile(null);
    } catch (err) {
      setError('Failed to update profile content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Profile Section</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input
            type="text"
            value={profileData.jobTitle}
            onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Introduction</label>
          <textarea
            value={profileData.introduction}
            onChange={(e) => setProfileData({ ...profileData, introduction: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Profile Photo</label>
          <input
            type="file"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
          {profileData.photoURL && (
            <div className="mt-4">
              <img
                src={profileData.photoURL}
                alt="Current Profile"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileManager;