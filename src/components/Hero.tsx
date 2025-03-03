import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface HeroData {
  name: string;
  jobTitle: string;
  introduction: string;
  photoURL: string;
}

const Hero = () => {
  const [heroData, setHeroData] = useState<HeroData>({
    name: '',
    jobTitle: '',
    introduction: '',
    photoURL: ''
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, 'profileContent', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as HeroData;
          setHeroData(data);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              {heroData.name}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 mb-6">
              {heroData.jobTitle}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {heroData.introduction}
            </p>
            <div className="flex space-x-4">
              <a
                href="#portfolio"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-1/2 mt-12 md:mt-0"
          >
            <img
              src={heroData.photoURL || '/default-profile.jpg'}
              alt={heroData.name}
              className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover mx-auto shadow-2xl"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown className="animate-bounce w-6 h-6 text-gray-400" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;