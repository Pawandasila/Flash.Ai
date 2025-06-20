import dedent from "dedent";

export default {
  SUGGESTIONS: [
    "Create ToDo App in React",
    "Create Budget Track App",
    "Create Gym Management Portal Dashboard",
    "Create Quiz App On History",
    "Create Login Signup Screen",
  ],
  HERO_HEADING: "What do you want to build?",
  HERO_DESC: "Prompt, run, edit, and deploy full-stack web apps.",
  INPUT_PLACEHOLDER: "What do you want to build?",
  SIGNIN_HEADING: "Continue With Bolt.New 2.0",
  SIGNIN_SUBHEADING:
    "To use Bolt you must log into an existing account or create one.",
  SIGNIN_AGREEMENT_TEXT:
    "By using Bolt, you agree to the collection of usage data for analytics.",

  DEFAULT_FILE: {
    "/public/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    },
    "/App.css": {
      code: `
            @tailwind base;
@tailwind components;
@tailwind utilities;`,
    },
    "/tailwind.config.js": {
      code: `
            /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
    },
    "/postcss.config.js": {
      code: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
`,
    },
  },  DEPENDENCIES: {
    // Core React & Vue
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vue": "^3.3.0",
    "@vue/runtime-dom": "^3.3.0",
    
    // TypeScript
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    
    // Styling
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.0.0",
    "bootstrap": "^5.3.0",
    "sass": "^1.69.0",
    
    // Utilities
    "uuid": "^9.0.1",
    "lodash": "^4.17.21",
    "date-fns": "^4.1.0",
    "validator": "^13.11.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    
    // Icons
    "lucide-react": "^0.469.0",
    "@heroicons/react": "^2.0.18",
    "react-icons": "^4.12.0",
    
    // HTTP & API
    "axios": "^1.6.0",
    "swr": "^2.2.4",
    "react-query": "^3.39.3",
    
    // State Management
    "zustand": "^4.4.7",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "pinia": "^2.1.7",
    
    // Forms
    "react-hook-form": "^7.48.0",
    "formik": "^2.4.5",
    "@hookform/resolvers": "^3.3.2",
    "yup": "^1.4.0",
    "zod": "^3.22.4",
    
    // Routing
    "react-router-dom": "^7.1.1",
    "vue-router": "^4.2.5",
    
    // Animation
    "framer-motion": "^10.16.0",
    "lottie-react": "^2.4.0",
    
    // Charts
    "react-chartjs-2": "^5.3.0",
    "chart.js": "^4.4.7",
    "recharts": "^2.8.0",
    
    // Backend/Database
    "firebase": "^11.1.0",
    "supabase": "^2.39.0",
    "@google/generative-ai": "^0.21.0",
    
    // Development
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "@vitejs/plugin-vue": "^4.5.0",
    "eslint": "^8.57.0",
    "prettier": "^3.1.0",
  },
  PRICING_DESC:
    "Start with a free account to speed up your workflow on public projects or boost your entire team with instantly-opening production environments.",
  PRICING_OPTIONS: [
    {
      name: "Basic",
      tokens: "50K",
      value: 50000,
      desc: "Ideal for hobbyists and casual users for light, exploratory use.",
      price: 4.99,
    },
    {
      name: "Starter",
      tokens: "120K",
      value: 120000,
      desc: "Designed for professionals who need to use Bolt a few times per week.",
      price: 9.99,
    },
    {
      name: "Pro",
      tokens: "2.5M",
      value: 2500000,
      desc: "Designed for professionals who need to use Bolt a few times per week.",
      price: 19.99,
    },
    {
      name: "Unlimited (License)",
      tokens: "Unlimited",
      value: 999999999,
      desc: "Designed for professionals who need to use Bolt a few times per week.",
      price: 49.99,
    },
  ],
  CHAT_PROMPT: dedent`
  You are an AI Assistant experienced in Full-Stack Development with expertise in React, Vue, Angular, Node.js, Python, and modern web technologies.
  
  GUIDELINES:
  - Provide clear, concise explanations about what you're building
  - Respond in less than 20 lines for better readability
  - Focus on the core functionality and user experience
  - Suggest best practices and modern development patterns
  - If the user asks about specific technologies, provide framework-specific advice
  - Skip lengthy code examples in chat (code will be generated separately)
  - Always consider accessibility and performance implications
  `,

  CODE_GEN_PROMPT: dedent`
Generate a comprehensive project based on the user's requirements. Support multiple frameworks and languages:

SUPPORTED FRAMEWORKS & LANGUAGES:
- React (JavaScript/TypeScript)
- Vue.js (JavaScript/TypeScript) 
- Angular (TypeScript)
- Node.js/Express (Backend)
- Python/Flask/FastAPI (Backend)
- HTML/CSS/JavaScript (Vanilla)

FRAMEWORK DETECTION:
- Auto-detect the desired framework from user input
- Default to React if no specific framework is mentioned
- Use appropriate file extensions (.js, .ts, .tsx, .vue, .py, etc.)

STYLING OPTIONS:
- Tailwind CSS (preferred)
- Bootstrap
- CSS Modules
- Styled Components
- SCSS/SASS

ENHANCED FEATURES:
- TypeScript support when requested
- Responsive design (mobile-first)
- Accessibility features (ARIA labels, semantic HTML)
- Error boundaries and error handling
- Loading states and skeleton screens
- Form validation
- Local storage persistence
- API integration patterns

AVAILABLE LIBRARIES:
Core: React, Vue, Angular, Express, Flask, FastAPI
UI: lucide-react, heroicons, react-icons
Utils: date-fns, lodash, uuid, validator
Charts: chart.js, react-chartjs-2, d3
HTTP: axios, fetch
State: redux, zustand, pinia, rxjs
Forms: react-hook-form, formik, vee-validate
Animation: framer-motion, lottie-react
Testing: jest, vitest, cypress

ICONS AVAILABLE:
Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, ArrowRight, ArrowLeft, ChevronUp, ChevronDown, Eye, EyeOff, Lock, Unlock, Bookmark, Share, Filter, Sort, Refresh, Save, Copy, Code, Database, Server, Cloud, Github, Twitter, Facebook, LinkedIn, Instagram

Return the response in JSON format with the following schema:
{
  "projectTitle": "",
  "framework": "", // react, vue, angular, node, python, vanilla
  "language": "", // javascript, typescript, python
  "explanation": "",
  "features": [], // Array of implemented features
  "files": {
    "/App.js": {
      "code": ""
    },
    ...
  },
  "generatedFiles": [],
  "dependencies": {}, // Package.json dependencies
  "scripts": {}, // NPM scripts
  "envVariables": [], // Required environment variables
  "apiEndpoints": [] // If backend, list API endpoints
}

REQUIREMENTS:
- Create production-ready, well-structured code
- Include proper error handling and loading states
- Add comments for complex logic
- Use modern ES6+ features
- Implement responsive design
- Add proper TypeScript types when using TypeScript
- Include proper file organization and folder structure
- Add proper validation and sanitization
- Use placeholder images from Unsplash: https://images.unsplash.com/
- Add emoji icons for better UX
- Include README.md with setup instructions
- Add proper SEO meta tags for web projects
- Implement proper state management patterns
  `,
};
