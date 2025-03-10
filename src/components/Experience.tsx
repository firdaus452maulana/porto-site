import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { WorkExperience } from '../types';
import { db } from '../lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

const Experience = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const q = query(collection(db, 'experiences'));
        const querySnapshot = await getDocs(q);
        const experiencesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WorkExperience[];
        setExperiences(experiencesData);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p>Loading experiences...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50" id="experience">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Work Experience</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A timeline of my professional journey and key achievements in software development.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-blue-200" />

          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`relative mb-12 md:mb-20 ${
                index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full" />

              <div className={`relative ${
                index % 2 === 0 
                  ? 'md:pr-12' 
                  : 'md:pl-12'
              }`}>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {experience.position}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {experience.company}
                      </p>
                    </div>
                    <p className="text-gray-500 mt-2 md:mt-0">
                      {experience.startDate} - {experience.endDate}
                    </p>
                  </div>

                  <ul className="list-disc list-inside text-gray-600 mb-4">
                    {experience.description.map((item, i) => (
                      <li key={i} className="mb-2">{item}</li>
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;