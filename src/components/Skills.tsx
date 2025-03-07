import { motion } from 'framer-motion';
import { Skill } from '../types';
import { useMemo, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const skillsCollection = collection(db, 'skills');

// Skill item display component
const SkillItem = ({ name }: { name: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm mb-2 mr-2"
  >
    {name}
  </motion.div>
);

// Main Skills component
const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch skills from Firestore
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const querySnapshot = await getDocs(skillsCollection);
        const skillsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }) as Skill);
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Memoized categories to prevent unnecessary re-renders
  const categories = useMemo(() => ({
    backend: 'Backend Development',
    genAi: 'Artificial Intelligence Development'
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

  if (loading) {
    return <div className="text-center py-20">Loading skills...</div>;
  }

  if (skills.length === 0) {
    return <div className="text-center py-20">No skills available</div>;
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
                <div className="flex flex-wrap">
                  {skills.map((skill) => (
                    <SkillItem
                      key={skill.name}
                      name={skill.name}
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