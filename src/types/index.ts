export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  imageUrl?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
  technologies: string[];
}

export interface Skill {
  name: string;
  category: string;
  proficiency: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  socialMedia: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface ProfileData {
  name: string;
  jobTitle: string;
  introduction: string;
  photoURL: string;
}