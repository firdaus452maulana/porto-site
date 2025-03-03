import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ContactInfo } from '../../types';

const ContactManager = () => {
  const { user } = useAuth();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    location: '',
    socialMedia: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'contactInfo', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContactInfo({
            email: '',
            phone: '',
            location: '',
            socialMedia: {},
            ...docSnap.data()
          });
        }
      } catch (err) {
        setError('Failed to load contact information');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      await setDoc(doc(db, 'contactInfo', 'main'), contactInfo);
    } catch (err) {
      setError('Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Contact Information</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={contactInfo.location}
            onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Media Links</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              value={contactInfo.socialMedia.linkedin || ''}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socialMedia: {
                  ...contactInfo.socialMedia,
                  linkedin: e.target.value
                }
              })}
              className="w-full p-2 border rounded"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <input
              type="url"
              value={contactInfo.socialMedia.github || ''}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socialMedia: {
                  ...contactInfo.socialMedia,
                  github: e.target.value
                }
              })}
              className="w-full p-2 border rounded"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Twitter</label>
            <input
              type="url"
              value={contactInfo.socialMedia.twitter || ''}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socialMedia: {
                  ...contactInfo.socialMedia,
                  twitter: e.target.value
                }
              })}
              className="w-full p-2 border rounded"
              placeholder="https://twitter.com/username"
            />
          </div>
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

export default ContactManager;