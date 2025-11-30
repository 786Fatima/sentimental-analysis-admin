import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import PostCard from "../../components/PostCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetAllPosts } from "../../services/admin-panel/postServices";
import { STATUS } from "../../utils/constants";
import { capitalizeWords } from "../../utils/functions";

export default function Posts() {
  const {
    data: posts,
    isLoading: postIsLoading,
    isError: postIsError,
  } = useGetAllPosts();

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!postIsLoading && posts) {
      let filtered = [...posts];

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (post) =>
            post?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post?.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Status filter
      if (filterStatus !== "all") {
        filtered = filtered?.filter((post) => post?.status === filterStatus);
      }

      // Sort
      filtered?.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b?.createdAt) - new Date(a?.createdAt);
          case "oldest":
            return new Date(a?.createdAt) - new Date(b?.createdAt);
          case "most-liked":
            return b?.feedbackStats?.totalLikes - a?.feedbackStats?.totalLikes;
          case "most-viewed":
            return b?.feedbackStats?.totalViews - a?.feedbackStats?.totalViews;
          default:
            return 0;
        }
      });

      setFilteredPosts(filtered);
    }
  }, [postIsLoading, posts, searchTerm, filterStatus, sortBy]);

  if (postIsLoading) return <LoadingSpinner isLoading={postIsLoading} />;

  // if (postIsError) return <ErrorScreen />;

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const handleEdit = (post) => {
    toast.info(
      `Edit functionality for "${post.title}" would be implemented here`
    );
  };

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      toast.success("Post deleted successfully");
      // In real app, would call API to delete
    }
  };

  const handleToggleStatus = (postId) => {
    toast.success("Post status updated successfully");
    // In real app, would call API to toggle status
  };

  const nextImage = () => {
    if (selectedPost && selectedPost.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev < selectedPost.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedPost && selectedPost.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev > 0 ? prev - 1 : selectedPost.images.length - 1
      );
    }
  };

  const PostModal = () => {
    if (!showModal || !selectedPost) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Post Details
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Images Carousel */}
            {selectedPost?.images && selectedPost?.images.length > 0 && (
              <div className="relative mb-6">
                <img
                  src={selectedPost?.images[currentImageIndex]}
                  alt={selectedPost?.title}
                  className="w-full h-64 object-cover rounded-lg"
                />

                {selectedPost?.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {selectedPost.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white bg-opacity-50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Post Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedPost?.title}
              </h3>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  Created:{" "}
                  {new Date(selectedPost?.createdAt).toLocaleDateString()}
                </span>
                <span>
                  Updated:{" "}
                  {new Date(selectedPost?.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <p
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(selectedPost?.description || ""),
                }}
              />

              {/* Tags */}
              {selectedPost?.tags && selectedPost?.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedPost?.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4 border-t">
                {selectedPost?.feedbackStats?.totalLikes > 0 && (
                  <span>{selectedPost?.feedbackStats?.totalLikes} likes</span>
                )}
                {selectedPost?.feedbackStats?.totalViews > 0 && (
                  <span>{selectedPost?.feedbackStats?.totalViews} views</span>
                )}
                {selectedPost?.feedbackStats?.totalComments > 0 && (
                  <span>
                    {selectedPost?.feedbackStats?.totalComments} comments
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    selectedPost.status === STATUS.ACTIVE
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedPost?.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600">Manage your published content</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center space-x-2">
          <FiPlus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            {Object.values(STATUS).map((status) => (
              <option key={status} value={status}>
                <span>{capitalizeWords(status)}</span>
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-liked">Most Liked</option>
            <option value="most-viewed">Most Viewed</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts?.map((post) => (
          <div
            key={post?._id}
            onClick={() => handlePostClick(post)}
            className="cursor-pointer"
          >
            <PostCard
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        ))}
      </div>

      {filteredPosts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No posts found matching your criteria.
          </p>
        </div>
      )}

      <PostModal />
    </div>
  );
}
