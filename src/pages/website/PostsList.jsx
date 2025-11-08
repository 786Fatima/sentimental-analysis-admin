import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiTrendingUp,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import useStore from "../../store";
import PageTransition from "../../components/website/PageTransition";
import { WEBSITE_ROUTES } from "../../utils/routes";

const { LOGIN } = WEBSITE_ROUTES;

// Image Carousel Component
function ImageCarousel({ images, postTitle }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative h-80 bg-gray-900 overflow-hidden group">
      <img
        src={images[currentIndex]}
        alt={postTitle}
        className="w-full h-full object-cover"
      />

      {images.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiChevronLeft className="w-5 h-5 text-gray-900" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiChevronRight className="w-5 h-5 text-gray-900" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex ? "bg-white w-6" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PostsList() {
  const navigate = useNavigate();
  const { posts, tags, interactions, isUserAuthenticated } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    let result = [...posts];

    // Filter by search
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tag
    if (selectedTag !== "all") {
      result = result.filter(
        (post) => post.tags && post.tags.includes(selectedTag)
      );
    }

    // Sort
    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.likes - a.likes);
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedTag, sortBy]);

  const getPostStats = (postId) => {
    const postInteractions = interactions.filter((i) => i.postId === postId);
    const likes = postInteractions.filter((i) => i.type === "like").length;
    const comments = postInteractions.filter(
      (i) => i.type === "comment"
    ).length;
    return { likes, comments };
  };

  const handlePostClick = (postId) => {
    navigate(`/user/post/${postId}`);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Explore Posts
            </h1>
            <p className="text-gray-600">
              Discover and engage with amazing content from our community
            </p>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag("all")}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedTag === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Posts
              </button>
              {tags.slice(0, 10).map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.name)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedTag === tag.name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {filteredPosts.map((post) => {
                const stats = getPostStats(post.id);
                const sentimentColor =
                  post.sentiment === "positive"
                    ? "text-green-600"
                    : post.sentiment === "negative"
                    ? "text-red-600"
                    : "text-yellow-600";

                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
                  >
                    {/* Post Header */}
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author ? post.author[0].toUpperCase() : "A"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {post.author || "Anonymous"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {timeAgo(post.createdAt)}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          post.sentiment === "positive"
                            ? "bg-green-50 text-green-600"
                            : post.sentiment === "negative"
                            ? "bg-red-50 text-red-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        <FiTrendingUp className="w-3 h-3" />
                        <span className="capitalize">{post.sentiment}</span>
                      </div>
                    </div>

                    {/* Image Carousel */}
                    <div
                      onClick={() => handlePostClick(post.id)}
                      className="cursor-pointer"
                    >
                      <ImageCarousel
                        images={post.images}
                        postTitle={post.title}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isUserAuthenticated) {
                              navigate(LOGIN);
                            }
                          }}
                          className="text-gray-700 hover:text-red-600 transition-colors"
                        >
                          <FiHeart className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => handlePostClick(post.id)}
                          className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          <FiMessageCircle className="w-6 h-6" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isUserAuthenticated) {
                              navigate(LOGIN);
                            }
                          }}
                          className="text-gray-700 hover:text-green-600 transition-colors"
                        >
                          <FiShare2 className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Likes Count */}
                      <div className="mb-2">
                        <p className="font-semibold text-sm">
                          {post.likes} likes
                        </p>
                      </div>

                      {/* Post Title & Description */}
                      <div className="mb-2">
                        <h4
                          onClick={() => handlePostClick(post.id)}
                          className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
                        >
                          {post.title}
                        </h4>
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {post.description}
                        </p>
                      </div>

                      {/* Comments Preview */}
                      {stats.comments > 0 && (
                        <button
                          onClick={() => handlePostClick(post.id)}
                          className="text-gray-500 text-sm hover:text-gray-700"
                        >
                          View all {stats.comments} comments
                        </button>
                      )}

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
