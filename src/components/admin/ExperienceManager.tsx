import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { WorkExperience } from '../../types';
import { PlusCircle, Edit2, Trash2, Loader } from 'lucide-react';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState<WorkExperience | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const q = query(collection(db, 'experiences'), orderBy('startDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedExperiences = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkExperience[];
      setExperiences(fetchedExperiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const experienceData = {
        company: formData.company,
        position: formData.position,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description.split('\n').map(item => item.trim()),
        technologies: formData.technologies.split(',').map(tech => tech.trim())
      };

      if (selectedExperience && isEditing) {
        await updateDoc(doc(db, 'experiences', selectedExperience.id), experienceData);
      } else {
        await addDoc(collection(db, 'experiences'), experienceData);
      }

      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        technologies: ''
      });
      setSelectedExperience(null);
      setIsEditing(false);
      await fetchExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience: WorkExperience) => {
    setSelectedExperience(experience);
    setIsEditing(true);
    setFormData({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate,
      description: experience.description.join('\n'),
      technologies: experience.technologies.join(', ')
    });
  };

  const handleDelete = async (experience: WorkExperience) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'experiences', experience.id));
      await fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            New Experience
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="text"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  placeholder="e.g., 2021"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="text"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  placeholder="e.g., Present"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description (one achievement per line)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="e.g.&#10;Led a team of 5 engineers&#10;Improved system performance by 40%&#10;Implemented CI/CD pipelines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="e.g., React, Node.js, AWS"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedExperience(null);
                  setFormData({
                    company: '',
                    position: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    technologies: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  selectedExperience ? 'Update Experience' : 'Add Experience'
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {experiences.map((experience) => (
          <div key={experience.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{experience.position}</h3>
                <p className="text-blue-600 font-medium">{experience.company}</p>
                <p className="text-gray-500">
                  {experience.startDate} - {experience.endDate}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(experience)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(experience)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <ul className="list-disc list-inside text-gray-600 mb-4">
              {experience.description.map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceManager;