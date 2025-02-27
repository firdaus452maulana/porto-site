import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { BlogPost, Project, WorkExperience } from '../../types';
import { FileText, Briefcase, Code2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardStats {
  totalPosts: number;
  totalProjects: number;
  totalExperience: number;
  recentPosts: BlogPost[];
  recentProjects: Project[];
  popularTechnologies: { name: string; count: number }[];
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalProjects: 0,
    totalExperience: 0,
    recentPosts: [],
    recentProjects: [],
    popularTechnologies: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch blog posts
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const posts = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];

      // Fetch projects
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projects = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];

      // Fetch experiences
      const experiencesSnapshot = await getDocs(collection(db, 'experiences'));
      const experiences = experiencesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkExperience[];

      // Calculate popular technologies
      const techCount = new Map<string, number>();
      projects.forEach(project => {
        project.technologies.forEach(tech => {
          techCount.set(tech, (techCount.get(tech) || 0) + 1);
        });
      });
      experiences.forEach(exp => {
        exp.technologies.forEach(tech => {
          techCount.set(tech, (techCount.get(tech) || 0) + 1);
        });
      });

      const popularTechnologies = Array.from(techCount.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalPosts: posts.length,
        totalProjects: projects.length,
        totalExperience: experiences.length,
        recentPosts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3),
        recentProjects: projects.slice(0, 3),
        popularTechnologies
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Blog Posts</p>
              <p className="text-2xl font-semibold">{stats.totalPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Code2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-semibold">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Work Experiences</p>
              <p className="text-2xl font-semibold">{stats.totalExperience}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Blog Posts</h3>
          <div className="space-y-4">
            {stats.recentPosts.map(post => (
              <div key={post.id} className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div className="ml-3">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(post.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {stats.recentProjects.map(project => (
              <div key={project.id} className="flex items-start">
                <Code2 className="h-5 w-5 text-gray-400 mt-1" />
                <div className="ml-3">
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-gray-500">
                    {project.technologies.slice(0, 3).join(', ')}
                    {project.technologies.length > 3 && ' ...'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Technologies */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Most Used Technologies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.popularTechnologies.map(tech => (
              <div
                key={tech.name}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
              >
                <span className="font-medium">{tech.name}</span>
                <span className="text-sm text-gray-500">{tech.count} projects</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;