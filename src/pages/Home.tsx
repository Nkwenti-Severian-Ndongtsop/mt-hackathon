import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Mountains Tech Hackathon
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
              Empowering innovators to build the next generation of technology solutions through collaborative funding and development.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose Mountains Tech?
            </h2>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="rounded-full bg-indigo-600 p-3">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="mt-8 text-xl font-medium text-gray-900 text-center">
                Community Driven
              </h3>
              <p className="mt-4 text-gray-500 text-center">
                Join a thriving community of developers, innovators, and investors working together to create impact.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="rounded-full bg-indigo-600 p-3">
                  <Target className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="mt-8 text-xl font-medium text-gray-900 text-center">
                Project Success
              </h3>
              <p className="mt-4 text-gray-500 text-center">
                Get the funding and support you need to turn your innovative ideas into successful projects.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="rounded-full bg-indigo-600 p-3">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="mt-8 text-xl font-medium text-gray-900 text-center">
                Secure Platform
              </h3>
              <p className="mt-4 text-gray-500 text-center">
                Advanced security measures ensure your projects and investments are protected at all times.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-indigo-200">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}