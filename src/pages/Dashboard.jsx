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
import {
  useGetDashboardStats,
  useGetTopInteractionsByStates,
  useGetTopPostInteractions,
} from "../services/admin-panel/dashboardServices";
import LoadingSpinner from "../components/LoadingSpinner";
import { capitalizeWords } from "../utils/functions";

const dateFilters = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

export default function Dashboard() {
  const { users, posts, tags, interactions, getStats } = useStore();

  const [stats, setStats] = useState({});
  const [timeFilter, setTimeFilter] = useState(dateFilters[0].value);
  const [postInteractionFilter, setPostInteractionFilter] = useState(
    dateFilters[0].value
  );
  const [stateWiseInteractionFilter, setStateWiseInteractionFilter] = useState(
    dateFilters[0].value
  );
  const [showTagModal, setShowTagModal] = useState(false);

  const {
    data: dashboardStats,
    isLoading: dashboardStatsIsLoading,
    isError: dashboardStatsIsError,
  } = useGetDashboardStats();
  const {
    data: postInteractions,
    isLoading: postInteractionIsLoading,
    isError: postInteractionIsError,
  } = useGetTopPostInteractions({ period: postInteractionFilter });
  const {
    data: stateWiseInteractions,
    isLoading: stateWiseInteractionIsLoading,
    isError: stateWiseInteractionIsError,
  } = useGetTopInteractionsByStates({ period: stateWiseInteractionFilter });

  useEffect(() => {
    setStats(getStats());
  }, [users, posts, interactions, getStats]);

  if (
    dashboardStatsIsLoading ||
    postInteractionIsLoading ||
    stateWiseInteractionIsLoading
  )
    return (
      <LoadingSpinner
        isLoading={
          dashboardStatsIsLoading ||
          postInteractionIsLoading ||
          stateWiseInteractionIsLoading
        }
      />
    );

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
            {/* {trend && (
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
            )} */}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const TopPostsSection = () => {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Top Posts</h3>
            <select
              value={postInteractionFilter}
              onChange={(e) => setPostInteractionFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {dateFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {postInteractions?.map((post, index) => (
              <div
                key={post?._id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {post?.title}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{post?.feedbackStats?.totalLikes} likes</span>
                      <span>{post?.feedbackStats?.totalViews} views</span>
                      <span>{post?.feedbackStats?.totalComments} comments</span>
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
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              State-wise Interactions
            </h3>
            <select
              value={stateWiseInteractionFilter}
              onChange={(e) => setStateWiseInteractionFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {dateFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {stateWiseInteractions?.map((post) => (
              <div
                key={post?.state}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm font-medium text-gray-900">
                  {capitalizeWords(post?.state)}
                </span>
                <div className="text-sm text-gray-600">
                  {post?.totalInteractions} interactions
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
          value={dashboardStats?.totalViews?.toLocaleString() || "0"}
          icon={FiEye}
          trend="up"
          trendValue="12"
          color="blue"
        />
        <StatCard
          title="Sentiments Analyzed"
          value={dashboardStats?.totalComments || "0"}
          icon={FiUsers}
          trend="up"
          trendValue="8"
          color="green"
        />
        <StatCard
          title="Registered Today"
          value={dashboardStats?.registeredUsersToday || "0"}
          icon={FiUserPlus}
          trend="down"
          trendValue="3"
          color="yellow"
        />
        <StatCard
          title="Total Interactions"
          value={dashboardStats?.totalInteractions || "0"}
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
