import { useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import {
  FiArrowLeft,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCopy,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiTrendingUp,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageTransition from "../../components/website/PageTransition";
import {
  useGetPostById,
  useUpdatePostCommentById,
  useUpdatePostLikeById,
  useUpdatePostViewById,
} from "../../services/website/postServices";
import useStore from "../../store";
import { URL_PARAMS, WEBSITE_ROUTES } from "../../utils/routes";

const { LOGIN, POSTS } = WEBSITE_ROUTES;

// Image Carousel Component for Post Detail
function PostImageCarousel({ images, postTitle }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative bg-gray-900 overflow-hidden group">
      <div className="aspect-square max-h-[600px] flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={postTitle}
          className="w-full h-full object-contain"
        />
      </div>

      {images.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiChevronRight className="w-6 h-6 text-gray-900" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white w-7" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PostDetail() {
  const { [URL_PARAMS.POST_ID]: postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isUserAuthenticated, user: userInfo } = useStore();
  const {
    data: postDetail,
    isLoading: postIsLoading,
    isError: postIsError,
  } = useGetPostById(postId);

  const { mutate: updatePostView, isPending: isPostViewUpdating } =
    useUpdatePostViewById();
  const { mutate: updatePostLike, isPending: isPostLikeUpdating } =
    useUpdatePostLikeById();
  const { mutate: updatePostComment, isPending: isPostCommentUpdating } =
    useUpdatePostCommentById();

  const [newComment, setNewComment] = useState("");
  const [isCommentEdit, setIsCommentEdit] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [postId]);

  const hasUpdatedViewRef = useRef(false);

  useEffect(() => {
    if (
      !postIsLoading &&
      postDetail &&
      isUserAuthenticated &&
      userInfo?.id &&
      !hasUpdatedViewRef.current
    ) {
      const userFeedback = postDetail?.feedback?.find(
        (fb) => fb?.userId === userInfo?.id
      );

      if (!userFeedback || !userFeedback?.hasViewed) {
        hasUpdatedViewRef.current = true; // ✅ block future calls
        updatePostView({ id: postId });
      }
    }
  }, [postId, postIsLoading, postDetail, isUserAuthenticated, userInfo]);
  // useEffect(() => {
  //   // Get comments for this post
  //   const postCommentsData = comments.filter((c) => c.postId === parseInt(id));
  //   setPostComments(postCommentsData);
  // }, [id, comments]);

  if (postIsLoading || isPostViewUpdating)
    return <LoadingSpinner isLoading={postIsLoading} />;

  if (!hasUpdatedViewRef.current) {
    hasUpdatedViewRef.current = true;
    updatePostView({ id: postId });
  }

  const handleLike = () => {
    if (!isUserAuthenticated) {
      toast.info("Please login to like posts");
      navigate(LOGIN);
      return;
    }

    updatePostLike(
      { id: postId },
      {
        onSuccess: (response) => {
          // Ensure the post detail is refetched after the like update
          queryClient.invalidateQueries(["post", postId]);

          const userFeedback = response?.feedback?.find(
            (fb) => fb?.userId === userInfo?.id
          );
          toast.success(userFeedback?.isLiked ? "Post liked!" : "Like removed");
        },
      }
    );
  };

  const handleComment = (e) => {
    e.preventDefault();

    if (!isUserAuthenticated) {
      toast.info("Please login to comment");
      navigate(LOGIN);
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    updatePostComment(
      { id: postId, data: { comment: newComment } },
      {
        onSuccess: () => {
          // Ensure the post detail is refetched after the like update
          queryClient.invalidateQueries(["post", postId]);
          setIsCommentEdit(false);
          toast.success("Comment added!");
        },
      }
    );
  };

  const handleShare = (platform) => {
    if (!isUserAuthenticated) {
      toast.info("Please login to share posts");
      navigate(LOGIN);
      return;
    }

    const url = window.location.href;
    const text = postDetail?.title;

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          text + " " + url
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    toast.success("Sharing postDetail?...");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
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

  if (!postDetail) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">Post not found</p>
            <Link to={POSTS} className="text-blue-600 hover:text-blue-700">
              ← Back to Posts
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const userFeedback = postDetail?.feedback?.find(
    (feedback) => feedback.userId === userInfo?.id
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(POSTS)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <FiArrowLeft />
            <span>Back to Posts</span>
          </button>

          {/* Instagram-like Post Card */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="lg:flex lg:max-h-[calc(100vh-200px)]">
              {/* Left Side - Image */}
              <div className="lg:w-3/5 bg-black">
                <PostImageCarousel
                  images={postDetail?.images}
                  postTitle={postDetail?.title}
                />
              </div>

              {/* Right Side - Content & Comments */}
              <div className="lg:w-2/5 flex flex-col max-h-[calc(100vh-200px)]">
                {/* Post Header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {postDetail?.admin
                      ? postDetail?.admin?.fullName?.toString().charAt(0)
                      : "A"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {postDetail?.admin?.fullName || "Anonymous"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {timeAgo(postDetail?.createdAt)}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      postDetail?.sentiment === "positive"
                        ? "bg-green-50 text-green-600"
                        : postDetail?.sentiment === "negative"
                        ? "bg-red-50 text-red-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    <FiTrendingUp className="w-3 h-3" />
                    <span className="capitalize">{postDetail?.sentiment}</span>
                  </div>
                </div>

                {/* Post Content & Comments - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Post Caption */}
                  <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">
                      {postDetail?.title}
                    </h1>
                    <p
                      className="text-gray-700 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          postDetail?.description || ""
                        ),
                      }}
                    />

                    {/* Tags */}
                    {postDetail?.tagsData &&
                      postDetail?.tagsData.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {postDetail?.tagsData?.map((tag) => (
                            <span
                              key={tag?._id}
                              className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
                            >
                              #{tag?.name}
                            </span>
                          ))}
                        </div>
                      )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <span>
                        {postDetail?.feedbackStats?.totalViews || 0} views
                      </span>
                      <span>•</span>
                      <span>{timeAgo(postDetail?.createdAt)}</span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Comments ({postDetail?.feedbackStats?.totalComments})
                    </h3>

                    {postDetail?.feedbackStats?.totalComments === 0 ? (
                      <p className="text-gray-500 text-center py-8 text-sm">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {postDetail?.feedback?.map((fb) => (
                          <div key={fb?.userId} className="flex gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-semibold text-sm">
                              {fb?.user
                                ? fb?.user?.fullName?.toString().charAt(0)
                                : "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-gray-50 rounded-2xl px-3 py-2">
                                <p className="font-semibold text-sm text-gray-900">
                                  {fb?.user?.fullName}
                                </p>
                                <p className="text-sm text-gray-700 break-words">
                                  {fb?.comment}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 px-3">
                                <span>{timeAgo(fb?.postedAt)}</span>
                                {fb?.userId === userInfo?.id && (
                                  <button
                                    className="hover:text-gray-700 font-medium"
                                    disabled={
                                      isPostCommentUpdating || isCommentEdit
                                    }
                                    onClick={() => {
                                      setIsCommentEdit(true);
                                      setNewComment(fb?.comment);
                                    }}
                                  >
                                    Edit
                                  </button>
                                )}
                                {/* <button className="hover:text-gray-700 font-medium">
                                  Like
                                </button>
                                <button className="hover:text-gray-700 font-medium">
                                  Reply
                                </button> */}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="border-t border-gray-200 p-4">
                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 mb-3">
                    <button
                      onClick={handleLike}
                      disabled={isPostLikeUpdating || postIsLoading}
                      className={`${
                        userFeedback?.isLiked
                          ? "text-red-600"
                          : "text-gray-700 hover:text-red-600"
                      } ${
                        isPostLikeUpdating || postIsLoading
                          ? "cursor-not-allowed opacity-50"
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
                      onClick={() =>
                        document.getElementById("comment-input-mobile").focus()
                      }
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <FiMessageCircle className="w-7 h-7" />
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <FiShare2 className="w-7 h-7" />
                    </button>
                    {/* <button className="ml-auto text-gray-700 hover:text-gray-900 transition-colors">
                      <FiBookmark className="w-7 h-7" />
                    </button> */}
                  </div>

                  {/* Likes Count */}
                  <div className="mb-3">
                    <p className="font-semibold text-sm">
                      {postDetail?.feedbackStats?.totalLikes} likes
                    </p>
                  </div>

                  {/* Comment Input */}
                  {isUserAuthenticated ? (
                    <>
                      {(!userFeedback?.comment || isCommentEdit) && (
                        <form onSubmit={handleComment} className="flex gap-2">
                          <input
                            id="comment-input-mobile"
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 px-4 py-2 border-0 focus:ring-0 text-sm"
                          />
                          <button
                            type="submit"
                            disabled={
                              !newComment.trim() ||
                              isPostCommentUpdating ||
                              postIsLoading
                            }
                            className="text-blue-600 font-semibold text-sm hover:text-blue-700 disabled:text-blue-300 disabled:cursor-not-allowed"
                          >
                            {isCommentEdit ? "Update" : "Post"}
                          </button>
                        </form>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <Link
                        to={LOGIN}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Log in to like or comment
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Full Content View (below image on mobile) */}
          <div className="lg:hidden mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About this post
            </h2>

            {/* Post Info */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">
                  Description
                </h3>
                <p
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(postDetail?.description || ""),
                  }}
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {postDetail?.tags &&
                    postDetail?.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>{timeAgo(postDetail?.createdAt)}</span>
                </div>
                <span>•</span>
                <span>{postDetail?.feedbackStats?.totalViews || 0} views</span>
              </div>
            </div>
          </div>
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
                    value={window.location.href}
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
