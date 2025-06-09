
import type { LucideIcon } from 'lucide-react';

export const ATIF_PORTFOLIO_DESCRIPTION = `Atif is a versatile Full-Stack Developer, UI/UX enthusiast, and Professional Graphics Designer with a passion for creating elegant and impactful digital experiences. With a strong foundation in modern web technologies including React, Next.js, Node.js, and Python, Atif excels at translating complex business requirements into intuitive and user-friendly applications. His portfolio showcases a diverse range of projects, from dynamic e-commerce platforms to data-driven dashboards and interactive web tools. Atif is a creative problem-solver, adept at both front-end aesthetics and back-end robustness, with growing expertise in Prompt Engineering to enhance AI interactions. He always strives for pixel-perfect execution and scalable solutions, and is also available for Freelance projects.`;

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string; // Can be a URL or a Data URI for local admin edits
  tags: string[];
  liveUrl?: string;
  sourceUrl?: string;
  imageHint?: string;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: 'project-1',
    title: 'E-commerce Platform X',
    description: 'A cutting-edge e-commerce solution with advanced features.',
    longDescription: 'Developed a full-stack e-commerce platform with features like personalized recommendations, secure payment gateway integration (Stripe), and real-time inventory management. Built using Next.js, TypeScript, PostgreSQL, and Tailwind CSS. Focused on scalability and user experience, resulting in a 20% increase in conversion rates for the client.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'online shopping',
    tags: ['Next.js', 'TypeScript', 'E-commerce', 'Stripe'],
    liveUrl: '#',
    sourceUrl: '#',
  },
  {
    id: 'project-2',
    title: 'Data Analytics Dashboard',
    description: 'Interactive dashboard for visualizing complex datasets.',
    longDescription: 'Created an interactive data analytics dashboard for a SaaS company, enabling users to visualize key metrics and trends. Used React, D3.js, and Node.js with Express. The dashboard features customizable widgets, data filtering, and export functionalities. Improved data-driven decision-making for stakeholders.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'charts graphs',
    tags: ['React', 'D3.js', 'Node.js', 'SaaS'],
    liveUrl: '#',
  },
  {
    id: 'project-3',
    title: 'AI Content Generator',
    description: 'A web app that leverages AI to generate creative content.',
    longDescription: 'Built an AI-powered content generation tool that assists users in creating marketing copy, blog posts, and social media updates. Integrated with OpenAI API. The front-end was developed with Vue.js and the back-end with Python (Flask). Features included various content templates and tone adjustments.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'artificial intelligence',
    tags: ['Vue.js', 'Python', 'AI', 'OpenAI', 'Prompt Engineering'],
    sourceUrl: '#',
  },
   {
    id: 'project-4',
    title: 'Mobile Health Companion',
    description: 'A React Native app for tracking fitness and wellness.',
    longDescription: 'Designed and developed a cross-platform mobile application using React Native to help users track their fitness activities, set wellness goals, and receive personalized health tips. Integrated with HealthKit and Google Fit. Implemented features like progress charts, reminders, and a social sharing component.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'mobile app health',
    tags: ['React Native', 'Mobile', 'HealthTech', 'Firebase'],
    liveUrl: '#',
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatarUrl?: string;
  avatarHint?: string;
}

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: "Atif transformed our outdated system into a modern, efficient platform. His technical skills and dedication were outstanding, delivering results that significantly improved our workflow.",
    author: "Jane Doe",
    role: "CEO",
    company: "Innovatech Solutions",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "business person"
  },
  {
    id: 'testimonial-2',
    quote: "The user interface Atif designed was not only intuitive and beautiful but also highly effective. Our customer engagement metrics shot up after the redesign he led.",
    author: "John Smith",
    role: "Marketing Director",
    company: "Connective Digital",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "professional headshot"
  },
  {
    id: 'testimonial-3',
    quote: "Working with Atif was a breeze. He has a unique ability to understand complex needs and translate them into functional, elegant solutions. He delivered beyond our expectations.",
    author: "Alice Brown",
    role: "Project Manager",
    company: "Synergy Corp",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "smiling individual"
  }
];

export const KEY_SKILLS: string[] = [
  "Full-Stack Development", "UI/UX Design", "Professional Graphics Designer", "Freelancer", "Creative Thinker", "React", "Next.js", "Node.js", 
  "Python", "TypeScript", "JavaScript", "Tailwind CSS", "ShadCN UI", 
  "Genkit", "Prompt Engineering", "Firebase", "PostgreSQL", "API Integration", 
  "Mobile Development (React Native)", "Agile Methodologies"
];

export type ServiceIconName = 'Server' | 'Palette' | 'Briefcase' | 'Brain';

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: ServiceIconName; 
}

export const SERVICES_DATA: Service[] = [
  {
    id: 'service-1',
    title: 'Web Development',
    description: 'Building responsive and scalable web applications tailored to your business needs, from front-end to back-end.',
    iconName: 'Server',
  },
  {
    id: 'service-2',
    title: 'UI/UX Design',
    description: 'Crafting intuitive and visually appealing user interfaces that enhance user experience and engagement.',
    iconName: 'Palette',
  },
  {
    id: 'service-3',
    title: 'Graphic Design',
    description: 'Creating stunning visuals, branding materials, and marketing assets that capture attention and tell your story.',
    iconName: 'Briefcase',
  },
  {
    id: 'service-4',
    title: 'AI Integration & Prompt Engineering',
    description: 'Leveraging artificial intelligence to build smart solutions and optimize interactions through expert prompt engineering.',
    iconName: 'Brain',
  },
];

export interface ContactDetails {
  email: string;
  phone: string;
  location: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
  }
}
export const CONTACT_INFO: ContactDetails = {
  email: "atif.codes@example.com",
  phone: "+1 (555) 123-4567",
  location: "Cyberjaya, Malaysia",
  socials: {
    github: "https://github.com/atif",
    linkedin: "https://linkedin.com/in/atif",
    twitter: "https://twitter.com/atif",
  }
};

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export const HEADER_NAV_ITEMS_DATA: NavItem[] = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'AI Hub', href: '#ai-tools' },
  { name: 'Contact', href: '#contact' },
];


export const LOCALSTORAGE_MESSAGES_KEY = "admin_messages_data";
export const LOCALSTORAGE_TESTIMONIALS_KEY = "admin_testimonials_data";
export const LOCALSTORAGE_HEADER_NAV_KEY = "admin_header_nav_items";

