export const ATIF_PORTFOLIO_DESCRIPTION = `Atif is a versatile Full-Stack Developer and UI/UX enthusiast with a passion for creating elegant and impactful digital experiences. With a strong foundation in modern web technologies including React, Next.js, Node.js, and Python, Atif excels at translating complex business requirements into intuitive and user-friendly applications. His portfolio showcases a diverse range of projects, from dynamic e-commerce platforms to data-driven dashboards and interactive web tools. Atif is a creative problem-solver, adept at both front-end aesthetics and back-end robustness, always striving for pixel-perfect execution and scalable solutions.`;

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
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
    tags: ['Vue.js', 'Python', 'AI', 'OpenAI'],
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
