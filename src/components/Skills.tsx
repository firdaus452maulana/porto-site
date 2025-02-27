import { motion } from 'framer-motion';
import { Skill } from '../types';
import { useMemo } from 'react';

// Moved skills data to a separate constant for better maintainability
const skills: Skill[] = [
  // Frontend
  { name: 'Node.js', category: 'frontend', proficiency: 90 },
  { name: 'Python', category: 'frontend', proficiency: 85 },
  { name: 'PostgreSQL', category: 'frontend', proficiency: 85 },

  // Backend
  { name: 'Node.js', category: 'backend', proficiency: 90 },
  { name: 'Python', category: 'backend', proficiency: 85 },
  { name: 'PostgreSQL', category: 'backend', proficiency: 85 },
  { name: 'MongoDB', category: 'backend', proficiency: 80 },
  { name: 'GraphQL', category: 'backend', proficiency: 75 },
  { name: 'Redis', category: 'backend', proficiency: 70 },

  // DevOps
  { name: 'Docker', category: 'devops', proficiency: 85 },
  { name: 'Kubernetes', category: 'devops', proficiency: 75 },
  { name: 'AWS', category: 'devops', proficiency: 80 },
  { name: 'CI/CD', category: 'devops', proficiency: 85 },
  { name: 'Terraform', category: 'devops', proficiency: 70 },
  { name: 'Monitoring', category: 'devops', proficiency: 75 }
];

// Extracted SkillBar to its own component for better reusability
interface SkillBarProps {
  name: string;
  proficiency: number;
}

const SkillBar = ({ name, proficiency }: SkillBarProps) => {
  if (proficiency < 0 || proficiency > 100) {
    console.error(`Invalid proficiency value for ${name}: ${proficiency}`);
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-sm text-gray-600">{proficiency}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          className="bg-blue-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  );
};

// Main Skills component
const Skills = () => {
  // Memoized categories to prevent unnecessary re-renders
  const categories = useMemo(() => ({
    frontend: 'Frontend Development',
    backend: 'Backend Development',
    devops: 'DevOps & Infrastructure'
  }), []);

  // Calculate grid columns based on number of categories
  const gridColumns = useMemo(() => {
    const count = Object.keys(categories).length;
    return {
      base: 1,
      md: count > 1 ? 2 : 1,
      lg: count > 2 ? 3 : count
    };
  }, [categories]);

  // Memoized skills grouped by category
  const skillsByCategory = useMemo(() => {
    return Object.keys(categories).reduce((acc, category) => {
      acc[category] = skills.filter(skill => skill.category === category);
      return acc;
    }, {} as Record<string, Skill[]>);
  }, [categories]);

  if (Object.keys(categories).length === 0) {
    return <div className="text-center py-20">No skills categories available</div>;
  }

  return (
    <section className="py-20 bg-white" id="skills">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Technical Skills</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency
            across different areas of software development.
          </p>
        </motion.div>

        <div 
          className={`grid grid-cols-${gridColumns.base} md:grid-cols-${gridColumns.md} lg:grid-cols-${gridColumns.lg} gap-8`}
        >
          {Object.entries(categories).map(([category, title]) => {
            const skills = skillsByCategory[category];
            
            if (!skills || skills.length === 0) {
              console.warn(`No skills found for category: ${category}`);
              return null;
            }

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold mb-6 text-gray-800">
                  {title}
                </h3>
                <div>
                  {skills.map((skill) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      proficiency={skill.proficiency}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;