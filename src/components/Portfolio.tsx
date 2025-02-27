import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Search } from 'lucide-react';
import { Project } from '../types';

const projects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Built a scalable e-commerce platform handling 100k+ monthly users. Implemented real-time inventory management and payment processing.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com',
    metrics: ['99.9% uptime', '50% faster load times', '30% increase in sales']
  },
  {
    id: '2',
    title: 'AI-Powered Analytics Dashboard',
    description: 'Developed a machine learning-based analytics platform for real-time business insights and predictive analysis.',
    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI', 'GCP'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com',
    metrics: ['90% prediction accuracy', '2M+ data points processed', '5x faster analysis']
  },
  {
    id: '3',
    title: 'Real-time Collaboration Tool',
    description: 'Created a real-time collaboration platform with video conferencing and document sharing capabilities.',
    technologies: ['WebRTC', 'Socket.io', 'React', 'Node.js', 'MongoDB'],
    imageUrl: 'https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com',
    metrics: ['10k+ daily active users', '<100ms latency', '4.8/5 user rating']
  },
  {
    id: '4',
    title: 'Blockchain Supply Chain',
    description: 'Implemented a blockchain-based supply chain tracking system for pharmaceutical companies.',
    technologies: ['Solidity', 'Ethereum', 'React', 'Node.js', 'AWS'],
    imageUrl: 'https://images.unsplash.com/photo-1621579943744-80a57a642438?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com',
    metrics: ['100% traceability', '45% cost reduction', '3M+ transactions']
  }
];

const Portfolio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('');

  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  ).sort();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech = !selectedTech || project.technologies.includes(selectedTech);
    return matchesSearch && matchesTech;
  });

  return (
    <section className="py-20 bg-gray-50" id="portfolio">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore some of my most impactful projects, showcasing my expertise in
            full-stack development, cloud architecture, and emerging technologies.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
          >
            <option value="">All Technologies</option>
            {allTechnologies.map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Metrics:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {project.metrics.map((metric, index) => (
                      <li key={index}>{metric}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex justify-end space-x-4">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink size={18} className="mr-1" />
                    Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-gray-900"
                  >
                    <Github size={18} className="mr-1" />
                    Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;