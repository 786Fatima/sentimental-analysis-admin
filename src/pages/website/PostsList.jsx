import { useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiHeart,
  FiMessageCircle,
  FiSearch,
  FiShare2,
  FiTrendingUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageTransition from "../../components/website/PageTransition";
import {
  useGetAllPosts,
  useUpdatePostLikeById,
} from "../../services/website/postServices";
import useStore from "../../store";
import { WEBSITE_ROUTES } from "../../utils/routes";
import { useGetAllTags } from "../../services/website/tagServices";

const { LOGIN, POST_DETAIL } = WEBSITE_ROUTES;

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
  const queryClient = useQueryClient();

  const { isUserAuthenticated, user: userInfo } = useStore();

  const {
    data: posts,
    isLoading: postIsLoading,
    isError: postIsError,
  } = useGetAllPosts();
  const {
    data: tags,
    isLoading: tagIsLoading,
    isError: tagIsError,
  } = useGetAllTags();

  const { mutate: updatePostLike, isPending: isPostLikeUpdating } =
    useUpdatePostLikeById();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [postId, setPostId] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!postIsLoading && posts) {
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
          (post) => post?.tags && post?.tags?.includes(selectedTag)
        );
      }

      // Sort
      if (sortBy === "recent") {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "popular") {
        result.sort(
          (a, b) => b?.feedbackStats?.totalLikes - a?.feedbackStats?.totalLikes
        );
      }

      setFilteredPosts(result);
    } else {
      setFilteredPosts([]);
    }
  }, [posts, postIsLoading, searchQuery, selectedTag, sortBy]);

  if (postIsLoading || tagIsLoading)
    return <LoadingSpinner isLoading={postIsLoading} />;

  const handlePostClick = (postId) => {
    navigate(`${POST_DETAIL}/${postId}`);
  };

  const handleLike = (id) => {
    if (!isUserAuthenticated) {
      toast.info("Please login to like posts");
      navigate(LOGIN);
      return;
    }

    updatePostLike(
      { id },
      {
        onSuccess: (response) => {
          // Ensure the post detail is refetched after the like update
          queryClient.invalidateQueries(["post"]);

          const userFeedback = response?.feedback?.find(
            (fb) => fb?.userId === userInfo?.id
          );
          toast.success(userFeedback?.isLiked ? "Post liked!" : "Like removed");
        },
      }
    );
  };

  const shareUrl = window.location.origin + `${POST_DETAIL}/${postId}`;

  const handleShare = (platform) => {
    if (!isUserAuthenticated) {
      toast.info("Please login to share posts");
      navigate(LOGIN);
      return;
    }

    const text = "Check out this post!";

    let customShareUrl = "";
    switch (platform) {
      case "facebook":
        customShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "twitter":
        customShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        customShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "whatsapp":
        customShareUrl = `https://wa.me/?text=${encodeURIComponent(
          text + " " + shareUrl
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    toast.success("Sharing postDetail?...");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
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
              {tags?.slice(0, 10).map((tag) => (
                <button
                  key={tag?._id}
                  onClick={() => setSelectedTag(tag?._id)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedTag === tag?._id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag?.name}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {filteredPosts?.map((post) => {
                const stats = post?.feedbackStats || {};
                const userFeedback = post?.feedback?.find(
                  (feedback) => feedback?.userId === userInfo?.id
                );
                return (
                  <div
                    key={post?._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
                  >
                    {/* Post Header */}
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {post.admin
                          ? post?.admin?.fullName?.toString().charAt(0)
                          : "A"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {post?.admin?.fullName || "Anonymous"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {timeAgo(post?.createdAt)}
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
                      onClick={() => handlePostClick(post?._id)}
                      className="cursor-pointer"
                    >
                      <ImageCarousel
                        images={post?.images || []}
                        postTitle={post?.title}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          disabled={isPostLikeUpdating || postIsLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isUserAuthenticated) {
                              navigate(LOGIN);
                            }

                            handleLike(post?._id);
                          }}
                          className={`${
                            userFeedback?.isLiked
                              ? "text-red-600"
                              : "text-gray-700 hover:text-red-600"
                          } ${
                            isPostLikeUpdating || postIsLoading
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <FiHeart
                            className={`w-7 h-7 ${
                              userFeedback?.isLiked ? "fill-current" : ""
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handlePostClick(post?._id)}
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
                            setPostId(post?._id);
                            setShowShareModal(true);
                          }}
                          className="text-gray-700 hover:text-green-600 transition-colors"
                        >
                          <FiShare2 className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Likes Count */}
                      <div className="mb-2">
                        <p className="font-semibold text-sm">
                          {stats?.totalLikes} likes
                        </p>
                      </div>

                      {/* Post Title & Description */}
                      <div className="mb-2">
                        <h4
                          onClick={() => handlePostClick(post?._id)}
                          className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
                        >
                          {post?.title}
                        </h4>
                        <p
                          className="text-gray-700 text-sm line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(post?.description || ""),
                          }}
                        />
                      </div>

                      {/* Comments Preview */}
                      {stats?.totalComments > 0 && (
                        <button
                          onClick={() => handlePostClick(post?._id)}
                          className="text-gray-500 text-sm hover:text-gray-700"
                        >
                          View all {stats?.totalComments} comments
                        </button>
                      )}

                      {/* Tags */}
                      {post?.tagsData && post?.tagsData?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post?.tagsData?.map((tag) => (
                            <span
                              key={tag?._id}
                              className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
                            >
                              #{tag?.name}
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

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Share Post
              </h3>

              {/* Social Share Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaFacebook className="w-5 h-5" />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  WhatsApp
                </button>
              </div>

              {/* Copy Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or copy link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
