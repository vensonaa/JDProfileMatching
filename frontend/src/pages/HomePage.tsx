import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  FileText, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze resumes and job descriptions for optimal matching.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'Intelligent scoring system that evaluates skills, experience, and cultural fit.',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: FileText,
      title: 'Resume Summary',
      description: 'Automatically generate concise, professional summaries of candidate profiles.',
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: Users,
      title: 'Interview Insights',
      description: 'Get suggested discussion topics and questions for effective interviews.',
      color: 'from-success-500 to-success-600'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Lightning-fast analysis powered by Groq LLM for quick results.',
      color: 'from-warning-500 to-warning-600'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security measures.',
      color: 'from-error-500 to-error-600'
    }
  ];

  const benefits = [
    'Reduce hiring time by 60%',
    'Improve candidate quality',
    'Eliminate bias in screening',
    'Standardize evaluation process',
    'Enhance interview preparation',
    'Track hiring metrics'
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 rounded-full mb-6">
            <Brain className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">AI-Powered Recruitment</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Smart JD-Profile</span>
            <br />
            <span className="text-gray-900">Matching</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your hiring process with intelligent AI that matches job descriptions 
            with candidate profiles, providing detailed insights and interview guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/analyze" className="btn-primary text-lg px-8 py-4">
              Start Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline your recruitment process and make better hiring decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group hover:scale-105 transition-transform duration-200"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Solution?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the benefits of AI-powered recruitment that saves time and improves outcomes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <CheckCircle className="w-6 h-6 text-success-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="card max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of companies using AI to make better hiring decisions.
          </p>
          <Link to="/analyze" className="btn-primary text-lg px-8 py-4">
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
