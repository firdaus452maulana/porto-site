import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import axios from 'axios';
import { db } from '../../lib/firebase';
import { Project } from '../../types';
import { PlusCircle, Edit2, Trash2, Loader, ExternalLink, Github } from 'lucide-react';
import { deleteCloudinaryImage } from '../../lib/cloudinary';

const PortfolioManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    demoUrl: '',
    githubUrl: '',
    startDate: '',
    finishDate: '',
    isPresent: false,
    imageFile: null as File | null,
    imageUrl: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('isPresent', 'desc'), orderBy('finishDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedProjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        imageUrl = await handleImageUpload(formData.imageFile);
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies.split(',').map(tech => tech.trim()),
        startDate: formData.startDate,
        finishDate: formData.finishDate,
        isPresent: formData.isPresent,
        demoUrl: formData.demoUrl || '',
        githubUrl: formData.githubUrl || '',
        imageUrl
      };

      if (selectedProject && isEditing) {
        await updateDoc(doc(db, 'projects', selectedProject.id), projectData);
      } else {
        await addDoc(collection(db, 'projects'), projectData);
      }

      setFormData({
        title: '',
        description: '',
        technologies: '',
        demoUrl: '',
        githubUrl: '',
        startDate: '',
        finishDate: '',
        isPresent: false,
        imageFile: null,
        imageUrl: ''
      });
      setSelectedProject(null);
      setIsEditing(false);
      await fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditing(true);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      imageFile: null,
      startDate: project.startDate,
      finishDate: project.finishDate,
      isPresent: project.isPresent,
      imageUrl: project.imageUrl
    });
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      if (project.imageUrl) {
        // Extract public_id from Cloudinary URL
        const publicId = project.imageUrl.split('/').slice(-1)[0].split('.')[0];
        await deleteCloudinaryImage(publicId);
      }
      await deleteDoc(doc(db, 'projects', project.id));
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
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
        <h2 className="text-2xl font-bold">Portfolio Projects</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            New Project
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Finish Date</label>
              <input
                type="date"
                value={formData.finishDate}
                onChange={(e) => setFormData({ ...formData, finishDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={formData.isPresent}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPresent}
                onChange={(e) => setFormData({ ...formData, isPresent: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Currently working on this project</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Demo URL</label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700">Project Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                className="mt-1 block w-full"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedProject(null);
                  setFormData({
                    title: '',
                    description: '',
                    technologies: '',
                    demoUrl: '',
                    githubUrl: '',
                    startDate: '',
                    finishDate: '',
                    isPresent: false,
                    imageFile: null,
                    imageUrl: ''
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
                  selectedProject ? 'Update Project' : 'Create Project'
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(project)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {project.imageUrl && (
              <div className="mb-4">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <p className="text-gray-600 mb-4">{project.description}</p>


            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, index) => (
                <span
                  key={`${tech}-${index}`}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={18} className="mr-1" />
                  Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <Github size={18} className="mr-1" />
                  Code
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioManager;