/**
 * Enhanced Suggestions Component
 * Provides intelligent project suggestions based on current trends and user preferences
 */

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Code, 
  Smartphone, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Camera,
  Music,
  Heart,
  BookOpen,
  Coffee,
  Car,
  Home,
  Gamepad2,
  DollarSign,
  Zap
} from 'lucide-react';

interface ProjectSuggestion {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  technologies: string[];
  features: string[];
  prompt: string;
  category: string;
}

const PROJECT_SUGGESTIONS: ProjectSuggestion[] = [
  {
    title: "Modern Todo App",
    description: "A feature-rich task management application with drag & drop, categories, and due dates",
    icon: Code,
    difficulty: "Beginner",
    estimatedTime: "2-3 hours",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Local Storage"],
    features: ["Drag & Drop", "Categories", "Due Dates", "Dark Mode", "Responsive Design"],
    prompt: "Create a modern todo app with React and TypeScript. Include drag and drop functionality, task categories, due dates, priority levels, and dark mode. Use Tailwind CSS for styling and implement local storage for persistence.",
    category: "Productivity"
  },
  {
    title: "E-commerce Dashboard",
    description: "Admin dashboard for managing products, orders, and analytics with beautiful charts",
    icon: ShoppingCart,
    difficulty: "Advanced",
    estimatedTime: "6-8 hours",
    technologies: ["React", "TypeScript", "Chart.js", "Tailwind CSS"],
    features: ["Product Management", "Order Tracking", "Analytics", "Charts", "Responsive Design"],
    prompt: "Build a comprehensive e-commerce admin dashboard with React and TypeScript. Include product management, order tracking, sales analytics with interactive charts, customer management, and inventory tracking. Use Chart.js for data visualization and Tailwind CSS for styling.",
    category: "Business"
  },
  {
    title: "Social Media Dashboard",
    description: "Monitor and manage multiple social media accounts from one interface",
    icon: Users,
    difficulty: "Intermediate",
    estimatedTime: "4-5 hours",
    technologies: ["React", "TypeScript", "Chart.js", "Tailwind CSS"],
    features: ["Multi-platform Integration", "Analytics", "Post Scheduling", "Real-time Updates"],
    prompt: "Create a social media management dashboard with React and TypeScript. Include features for managing multiple social platforms, post scheduling, engagement analytics, follower growth tracking, and content calendar. Use Chart.js for analytics visualization.",
    category: "Marketing"
  },
  {
    title: "Expense Tracker",
    description: "Personal finance app with budget tracking, categories, and spending insights",
    icon: DollarSign,
    difficulty: "Intermediate",
    estimatedTime: "3-4 hours",
    technologies: ["React", "TypeScript", "Chart.js", "Tailwind CSS"],
    features: ["Budget Tracking", "Categories", "Spending Analysis", "Export Data", "Mobile Responsive"],
    prompt: "Develop a personal expense tracker app with React and TypeScript. Include budget setting, expense categorization, spending analysis with charts, recurring expenses, export functionality, and mobile-responsive design. Use Chart.js for financial charts.",
    category: "Finance"
  },
  {
    title: "Weather App",
    description: "Beautiful weather application with forecasts, maps, and location-based updates",
    icon: Zap,
    difficulty: "Beginner",
    estimatedTime: "2-3 hours",
    technologies: ["React", "TypeScript", "Weather API", "Tailwind CSS"],
    features: ["Current Weather", "7-day Forecast", "Location Search", "Weather Maps", "Responsive"],
    prompt: "Create a modern weather application with React and TypeScript. Include current weather conditions, 7-day forecast, location search, weather maps, hourly forecast, and beautiful animations. Use a weather API for data and Tailwind CSS for styling.",
    category: "Utility"
  },
  {
    title: "Recipe Finder",
    description: "Discover and save recipes with ingredient-based search and meal planning",
    icon: Coffee,
    difficulty: "Intermediate",
    estimatedTime: "4-5 hours",
    technologies: ["React", "TypeScript", "Recipe API", "Tailwind CSS"],
    features: ["Recipe Search", "Ingredient Filter", "Meal Planning", "Favorites", "Shopping List"],
    prompt: "Build a recipe finder app with React and TypeScript. Include recipe search by ingredients, meal planning, favorites system, shopping list generation, nutritional information, and cooking timers. Use a recipe API for data.",
    category: "Lifestyle"
  },
  {
    title: "Music Player",
    description: "Streaming music player with playlists, visualizations, and social features",
    icon: Music,
    difficulty: "Advanced",
    estimatedTime: "6-7 hours",
    technologies: ["React", "TypeScript", "Web Audio API", "Tailwind CSS"],
    features: ["Audio Playback", "Playlists", "Visualizations", "Search", "Offline Mode"],
    prompt: "Create a feature-rich music player with React and TypeScript. Include audio playback controls, playlist management, audio visualizations, search functionality, offline mode, and social sharing. Use Web Audio API for audio processing.",
    category: "Entertainment"
  },
  {
    title: "Fitness Tracker",
    description: "Track workouts, progress, and health metrics with goal setting",
    icon: Heart,
    difficulty: "Intermediate",
    estimatedTime: "5-6 hours",
    technologies: ["React", "TypeScript", "Chart.js", "Tailwind CSS"],
    features: ["Workout Logging", "Progress Tracking", "Goal Setting", "Health Metrics", "Calendar"],
    prompt: "Develop a fitness tracking app with React and TypeScript. Include workout logging, progress tracking with charts, goal setting, health metrics monitoring, exercise calendar, and achievement system. Use Chart.js for progress visualization.",
    category: "Health"
  },
  {
    title: "Real Estate Platform",
    description: "Property listing platform with search, filters, and virtual tours",
    icon: Home,
    difficulty: "Advanced",
    estimatedTime: "8-10 hours",
    technologies: ["React", "TypeScript", "Maps API", "Tailwind CSS"],
    features: ["Property Listings", "Advanced Search", "Maps Integration", "Virtual Tours", "Agent Profiles"],
    prompt: "Build a comprehensive real estate platform with React and TypeScript. Include property listings, advanced search and filtering, maps integration, virtual tour functionality, agent profiles, mortgage calculator, and comparison tools.",
    category: "Real Estate"
  },
  {
    title: "Learning Management System",
    description: "Educational platform with courses, quizzes, and progress tracking",
    icon: BookOpen,
    difficulty: "Advanced",
    estimatedTime: "10-12 hours",
    technologies: ["React", "TypeScript", "Video API", "Chart.js", "Tailwind CSS"],
    features: ["Course Management", "Video Lessons", "Quizzes", "Progress Tracking", "Certificates"],
    prompt: "Create a learning management system with React and TypeScript. Include course creation, video lessons, interactive quizzes, progress tracking, certificate generation, discussion forums, and assignment submission. Use Chart.js for analytics.",
    category: "Education"
  }
];

const DIFFICULTY_COLORS = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800'
};

interface EnhancedSuggestionsProps {
  onSelectSuggestion: (prompt: string) => void;
  selectedCategory?: string;
}

const EnhancedSuggestions: React.FC<EnhancedSuggestionsProps> = ({ 
  onSelectSuggestion, 
  selectedCategory 
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  
  const categories = ['All', ...Array.from(new Set(PROJECT_SUGGESTIONS.map(s => s.category)))];
  
  const filteredSuggestions = activeCategory === 'All' 
    ? PROJECT_SUGGESTIONS 
    : PROJECT_SUGGESTIONS.filter(s => s.category === activeCategory);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Enhanced Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSuggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
              style={{
                backgroundColor: 'rgba(39, 39, 39, 0.8)',
              }}
              onClick={() => onSelectSuggestion(suggestion.prompt)}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '1px' }}>
                <div className="w-full h-full rounded-2xl" style={{ backgroundColor: 'rgba(39, 39, 39, 0.95)' }} />
              </div>

              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                        {suggestion.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[suggestion.difficulty]}`}
                        >
                          {suggestion.difficulty}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {suggestion.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {suggestion.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-blue-300 mb-3 uppercase tracking-wide">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-purple-300 mb-3 uppercase tracking-wide">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.features.slice(0, 3).map((feature, featureIndex) => (
                      <span 
                        key={featureIndex}
                        className="px-3 py-1 text-xs font-medium bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20"
                      >
                        {feature}
                      </span>
                    ))}
                    {suggestion.features.length > 3 && (
                      <span className="px-3 py-1 text-xs font-medium bg-gray-500/10 text-gray-400 rounded-full border border-gray-500/20">
                        +{suggestion.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

                {/* CTA Button */}
                <button
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm
                    hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 
                    shadow-lg hover:shadow-xl hover:shadow-blue-500/25 group-hover:shadow-2xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSuggestion(suggestion.prompt);
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Build This Project
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredSuggestions.length === 0 && (
        <div className="text-center py-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09M6.343 6.343A8 8 0 1017.657 17.657 8 8 0 106.343 6.343z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Projects Found</h3>
            <p className="text-gray-400 text-sm">
              No projects found for the selected category. Try selecting a different category.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSuggestions;
