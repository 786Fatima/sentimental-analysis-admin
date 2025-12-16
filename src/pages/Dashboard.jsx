import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiEye,
  FiUserPlus,
  FiTrendingUp,
  FiTrendingDown,
  FiSettings,
} from "react-icons/fi";
import useStore from "../store";
import TagModal from "../components/TagModal";

export default function Dashboard() {
  const { users, posts, tags, interactions, getStats } = useStore();
  const [stats, setStats] = useState({});
  const [timeFilter, setTimeFilter] = useState("today");
  const [showTagModal, setShowTagModal] = useState(false);

  useEffect(() => {
    setStats(getStats());
  }, [users, posts, interactions, getStats]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "blue",
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      yellow: "bg-yellow-50 text-yellow-600",
      purple: "bg-purple-50 text-purple-600",
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center mt-1">
                {trend === "up" ? (
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm ${
                    trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trendValue}% from yesterday
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const TopPostsSection = () => {
    const [filter, setFilter] = useState("today");
    const topPosts = posts.slice(0, 5);

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Top Posts</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="date">Custom Date</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {post.title}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{post.likes} likes</span>
                      <span>{post.views} views</span>
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TopTagsSection = () => {
    const topTags = tags.slice(0, 5);

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Top Tags</h3>
            <button
              onClick={() => setShowTagModal(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              title="Manage Tags"
            >
              <FiSettings className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {topTags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">
                    #{tag.name}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {tag.likesCount + tag.commentsCount} interactions
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const StateInteractionsSection = () => {
    const [filter, setFilter] = useState("today");

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              State-wise Interactions
            </h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Today</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="date">Custom Date</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {interactions.map((state) => (
              <div
                key={state.id}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm font-medium text-gray-900">
                  {state.state}
                </span>
                <div className="text-sm text-gray-600">
                  {filter === "today" && state.todayInteractions}
                  {filter === "weekly" && state.weeklyAvg}
                  {filter === "monthly" && state.monthlyAvg}
                  {filter === "date" && state.dailyAvg} interactions
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Visits"
          value={stats.totalVisits?.toLocaleString() || "0"}
          icon={FiEye}
          trend="up"
          trendValue="12"
          color="blue"
        />
        <StatCard
          title="Users Online"
          value={stats.usersOnline || "0"}
          icon={FiUsers}
          trend="up"
          trendValue="8"
          color="green"
        />
        <StatCard
          title="Registered Today"
          value={stats.usersRegisteredToday || "0"}
          icon={FiUserPlus}
          trend="down"
          trendValue="3"
          color="yellow"
        />
        <StatCard
          title="Today's Interactions"
          value={stats.todayInteractions || "0"}
          icon={FiTrendingUp}
          trend="up"
          trendValue="15"
          color="purple"
        />
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopPostsSection />
        <TopTagsSection />
        <StateInteractionsSection />
      </div>

      {/* Tag Management Modal */}
      <TagModal open={showTagModal} onClose={() => setShowTagModal(false)} />
    </div>
  );
}
