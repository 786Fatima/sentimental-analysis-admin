import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp,
  FiUsers,
  FiMessageCircle,
  FiHeart,
} from "react-icons/fi";
import PageTransition from "../../components/website/PageTransition";
import { WEBSITE_ROUTES } from "../../utils/routes";

const { POSTS, LOGIN, REGISTER } = WEBSITE_ROUTES;

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Trending Posts",
      description: "Discover the most popular content from our community",
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Active Community",
      description: "Join thousands of users sharing their thoughts",
    },
    {
      icon: <FiMessageCircle className="w-8 h-8" />,
      title: "Engage & Discuss",
      description: "Comment and share your opinions on posts",
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: "Like & Share",
      description: "Show appreciation and spread great content",
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">SentiPost</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Discover, Share, and Engage with Amazing Content
            </p>
            <p className="text-lg text-gray-500 mb-12">
              Join our community to explore trending posts, share your thoughts,
              and connect with others through meaningful discussions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate(LOGIN)}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate(POSTS, { replace: true })}
                className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Browse Posts
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-24 bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Growing Community
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  1000+
                </div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  5000+
                </div>
                <div className="text-gray-600">Posts Shared</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  10K+
                </div>
                <div className="text-gray-600">Comments & Likes</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our community today and start exploring amazing content!
            </p>
            <button
              onClick={() => navigate(REGISTER)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
