import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Skill } from '../../types';

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Skill>({ name: '', category: '' });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  const skillsCollection = collection(db, 'skills');

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

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.name || !newSkill.category) return;
    
    try {
      const docRef = await addDoc(skillsCollection, newSkill);
      setSkills([...skills, { ...newSkill, id: docRef.id }]);
      setNewSkill({ name: '', category: '' });
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleUpdateSkill = async () => {
    if (!editingSkill) return;
    
    try {
      await updateDoc(doc(db, 'skills', editingSkill.id!), {
        name: editingSkill.name,
        category: editingSkill.category
      });
      setSkills(skills.map(skill => 
        skill.id === editingSkill.id ? editingSkill : skill
      ));
      setEditingSkill(null);
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
      setSkills(skills.filter(skill => skill.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  if (loading) return <div>Loading skills...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Skills</h1>
      
      {/* Add/Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingSkill ? 'Edit Skill' : 'Add New Skill'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Skill Name"
            value={editingSkill ? editingSkill.name : newSkill.name}
            onChange={(e) => editingSkill
              ? setEditingSkill({ ...editingSkill, name: e.target.value })
              : setNewSkill({ ...newSkill, name: e.target.value })
            }
            className="p-2 border rounded"
          />
          <select
            value={editingSkill ? editingSkill.category : newSkill.category}
            onChange={(e) => editingSkill
              ? setEditingSkill({ ...editingSkill, category: e.target.value })
              : setNewSkill({ ...newSkill, category: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="">Select Category</option>
            <option value="backend">Backend</option>
            <option value="genAi">Generative AI</option>
          </select>
        </div>
        <div className="mt-4">
          {editingSkill ? (
            <button
              onClick={handleUpdateSkill}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Update Skill
            </button>
          ) : (
            <button
              onClick={handleAddSkill}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Add Skill
            </button>
          )}
          {editingSkill && (
            <button
              onClick={() => setEditingSkill(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Skills List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{skill.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingSkill(skill)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skill.id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Category: {skill.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsManager;