"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  GetCourseContentApi,
  AddQuestionApi,
  AddAnswerApi,
  AddReviewApi,
  AddReviewReplyApi,
  GetCourseReviewsApi,
  EditReviewApi,
  GetUserReviewApi,
} from "@/app/APIs/routes";
import {
  Button,
  Collapse,
  Spin,
  message,
  Tabs,
  Rate,
  Input,
  Avatar,
  Card,
  Divider,
} from "antd";
import {
  PlayCircleOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  FileTextOutlined,
  FolderOutlined,
  QuestionCircleOutlined,
  StarOutlined,
  UserOutlined,
  SendOutlined,
} from "@ant-design/icons";
import VideoPlayer from "@/app/components/AdminComponents/VideoPlayer";
import Link from "next/link";
import { useSelector } from "react-redux";
import { MdReplyAll } from "react-icons/md";
import { VscVerifiedFilled } from "react-icons/vsc";
import Image from "next/image";
import { socket } from "@/socketio";
import InitialPageloader from "@/app/components/initialPageloader";

const { TextArea } = Input;

interface CourseSection {
  sectionName: string;
  data: {
    _id: string;
    name: string;
    description: string;
    url: string;
    videoLength: string;
    link: { title: string; url: string }[];
    questions?: {
      _id: string;
      user: {
        _id: string;
        name: string;
        avatar: { url: string };
        role: string;
      };
      question: string;
      answer: {
        _id: string;
        user: {
          _id: string;
          name: string;
          avatar: { url: string };
          role: string;
        };
        answer: string;
        createdAt: Date;
      }[];
      createdAt: Date;
    }[];
  }[];
}

interface LessonData {
  _id: string;
  name: string;
  description: string;
  url: string;
  videoLength: string;
  link: { title: string; url: string }[];
  questions?: {
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar: { url: string };
      role: string;
    };
    question: string;
    answer: {
      _id: string;
      user: {
        _id: string;
        name: string;
        avatar: { url: string };
        role: string;
      };
      answer: string;
      createdAt: Date;
    }[];
    createdAt: Date;
  }[];
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: { url: string };
    role: string;
  };
  comment: string;
  rating: number;
  createdAt: Date;
  reviewReplies: {
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar: { url: string };
      role: string;
    };
    reply: string;
    createdAt: Date;
  }[];
}

const CourseAccess = () => {
  const [courseContent, setCourseContent] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState({
    section: 0,
    lesson: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");

  // Q&A states
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);

  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewReplyText, setReviewReplyText] = useState("");
  const [replyingToReview, setReplyingToReview] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userReview, setUserReview] = useState<{
    _id: string;
    comment: string;
    rating: number;
    createdAt: Date;
  } | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);

  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  // Get user from Redux store
  const { user } = useSelector((state: any) => state.UserReducer);

  useEffect(() => {
    if (courseId) {
      fetchCourseContent();
      fetchReviews();
      fetchUserReview();
    }
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const response = await GetCourseReviewsApi(courseId);
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await GetUserReviewApi(courseId);
      const responseData = response.data as any;
      if (responseData.success && responseData.data) {
        setUserReview(responseData.data);
        setReviewText(responseData.data.comment);
        setReviewRating(responseData.data.rating);
      }
    } catch (error) {
      console.error("Failed to fetch user review:", error);
    }
  };

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      const response = await GetCourseContentApi(courseId);

      if (response.data.success) {
        setCourseContent(response.data.data);
        // Set first video as default
        if (response.data.data[0]?.data[0]) {
          const firstLesson = response.data.data[0].data[0];
          setCurrentVideo(firstLesson.url);
          setCurrentLesson(firstLesson);
          setCurrentLessonIndex({ section: 0, lesson: 0 });
          setCurrentLessonIndex({ section: 0, lesson: 0 });
        }
      }
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
          "Access denied. You are not enrolled in this course.",
      );
      message.error(
        error.response?.data?.message ||
          "Access denied. You are not enrolled in this course.",
      );
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (
    lesson: LessonData,
    sectionIndex: number,
    lessonIndex: number,
  ) => {
    const handleLessonClick = (
      lesson: LessonData,
      sectionIndex: number,
      lessonIndex: number,
    ) => {
      setCurrentVideo(lesson.url);
      setCurrentLesson(lesson);
      setCurrentLessonIndex({ section: sectionIndex, lesson: lessonIndex });
    };

    const getAllLessons = () => {
      const allLessons: {
        lesson: LessonData;
        sectionIndex: number;
        lessonIndex: number;
      }[] = [];
      courseContent.forEach((section, sectionIndex) => {
        section.data.forEach((lesson, lessonIndex) => {
          allLessons.push({ lesson, sectionIndex, lessonIndex });
        });
      });
      return allLessons;
    };

    const getCurrentLessonGlobalIndex = () => {
      const allLessons = getAllLessons();
      return allLessons.findIndex(
        (item) =>
          item.sectionIndex === currentLessonIndex.section &&
          item.lessonIndex === currentLessonIndex.lesson,
      );
    };

    const navigateToLesson = (direction: "prev" | "next") => {
      const allLessons = getAllLessons();
      const currentGlobalIndex = getCurrentLessonGlobalIndex();

      let newIndex;
      if (direction === "prev") {
        newIndex = currentGlobalIndex > 0 ? currentGlobalIndex - 1 : 0;
      } else {
        newIndex =
          currentGlobalIndex < allLessons.length - 1
            ? currentGlobalIndex + 1
            : allLessons.length - 1;
      }

      const targetLesson = allLessons[newIndex];
      if (targetLesson) {
        handleLessonClick(
          targetLesson.lesson,
          targetLesson.sectionIndex,
          targetLesson.lessonIndex,
        );
      }
    };

    const canNavigatePrev = () => getCurrentLessonGlobalIndex() > 0;
    const canNavigateNext = () =>
      getCurrentLessonGlobalIndex() < getAllLessons().length - 1;
    setCurrentLessonIndex({ section: sectionIndex, lesson: lessonIndex });
  };

  const getAllLessons = () => {
    const allLessons: {
      lesson: LessonData;
      sectionIndex: number;
      lessonIndex: number;
    }[] = [];
    courseContent.forEach((section, sectionIndex) => {
      section.data.forEach((lesson, lessonIndex) => {
        allLessons.push({ lesson, sectionIndex, lessonIndex });
      });
    });
    return allLessons;
  };

  const getCurrentLessonGlobalIndex = () => {
    const allLessons = getAllLessons();
    return allLessons.findIndex(
      (item) =>
        item.sectionIndex === currentLessonIndex.section &&
        item.lessonIndex === currentLessonIndex.lesson,
    );
  };

  const navigateToLesson = (direction: "prev" | "next") => {
    const allLessons = getAllLessons();
    const currentGlobalIndex = getCurrentLessonGlobalIndex();

    let newIndex;
    if (direction === "prev") {
      newIndex = currentGlobalIndex > 0 ? currentGlobalIndex - 1 : 0;
    } else {
      newIndex =
        currentGlobalIndex < allLessons.length - 1
          ? currentGlobalIndex + 1
          : allLessons.length - 1;
    }

    const targetLesson = allLessons[newIndex];
    if (targetLesson) {
      handleLessonClick(
        targetLesson.lesson,
        targetLesson.sectionIndex,
        targetLesson.lessonIndex,
      );
    }
  };

  const canNavigatePrev = () => getCurrentLessonGlobalIndex() > 0;
  const canNavigateNext = () =>
    getCurrentLessonGlobalIndex() < getAllLessons().length - 1;

  const formatDuration = (duration: string) => {
    return duration || "N/A";
  };

  // Q&A Handlers
  const handleAddQuestion = async () => {
    if (!questionText.trim() || !currentLesson) return;

    setQuestionLoading(true);
    try {
      await AddQuestionApi({
        question: questionText,
        courseId,
        contentId: currentLesson._id,
      });
      message.success("Question posted successfully!");
      socket.emit("notification");

      setQuestionText("");
      fetchCourseContent(); // Refresh to get updated questions
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to post question");
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleAddAnswer = async (questionId: string) => {
    if (!answerText.trim() || !currentLesson) return;

    setQuestionLoading(true);
    try {
      await AddAnswerApi({
        answer: answerText,
        courseId,
        contentId: currentLesson._id,
        questionId,
      });
      message.success("Answer posted successfully!");
      setAnswerText("");
      setReplyingTo(null);
      fetchCourseContent(); // Refresh to get updated answers
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to post answer");
    } finally {
      setQuestionLoading(false);
    }
  };

  // Review Handlers
  const handleAddReview = async () => {
    if (!reviewText.trim() || reviewRating === 0) {
      message.error("Please provide both rating and comment");
      return;
    }

    setReviewLoading(true);
    try {
      await AddReviewApi(
        {
          rating: reviewRating,
          comment: reviewText,
        },
        courseId,
      );
      message.success("Review posted successfully!");
      socket.emit('notification')
      
      setReviewText("");
      setReviewRating(0);
      fetchReviews();
      fetchUserReview();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to post review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleEditReview = async () => {
    if (!reviewText.trim() || reviewRating === 0) {
      message.error("Please provide both rating and comment");
      return;
    }

    setReviewLoading(true);
    try {
      await EditReviewApi(
        {
          rating: reviewRating,
          comment: reviewText,
        },
        courseId,
      );
      message.success("Review updated successfully!");
      socket.emit('notification')
      
      setIsEditingReview(false);
      fetchReviews();
      fetchUserReview();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to update review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingReview(false);
    if (userReview) {
      setReviewText(userReview.comment);
      setReviewRating(userReview.rating);
    }
  };

  const handleAddReviewReply = async (reviewId: string) => {
    if (!reviewReplyText.trim()) return;

    setReviewLoading(true);
    try {
      await AddReviewReplyApi({
        reply: reviewReplyText,
        courseId,
        reviewId,
      });
      message.success("Reply posted successfully!");
      setReviewReplyText("");
      setReplyingToReview(null);
      fetchReviews(); // Refresh reviews
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to post reply");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <InitialPageloader />
    );
  }

  const collapseItems = courseContent.map((section, sectionIndex) => ({
    key: sectionIndex.toString(),
    label: (
      <div className="flex justify-between items-center">
        <span className="font-semibold text-primary-light dark:text-primary-dark">
          {section.sectionName}
        </span>
        <span className="text-sm text-secondary-light dark:text-secondary-dark">
          {section.data.length} lessons
        </span>
      </div>
    ),
    children: (
      <div className="space-y-2">
        {section.data.map((lesson, lessonIndex) => (
          <div
            key={lesson._id}
            onClick={() => handleLessonClick(lesson, sectionIndex, lessonIndex)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
              currentLesson?._id === lesson._id
                ? "bg-bprimary/10 border-bprimary"
                : "bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark hover:bg-bprimary/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <PlayCircleOutlined
                className={`text-lg ${
                  currentLesson?._id === lesson._id
                    ? "text-bprimary"
                    : "text-secondary-light dark:text-secondary-dark"
                }`}
              />
              <div className="flex-1">
                <h4 className="font-medium text-primary-light dark:text-primary-dark">
                  {lesson.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <ClockCircleOutlined className="text-xs text-secondary-light dark:text-secondary-dark" />
                  <span className="text-xs text-secondary-light dark:text-secondary-dark">
                    {formatDuration(lesson.videoLength)} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  }));

  const tabItems = [
    {
      key: "overview",
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          Overview
        </span>
      ),
      children: (
        <div className=" space-y-4">
          {currentLesson ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">
                  About this lesson
                </h3>
                <p className="text-secondary-light dark:text-secondary-dark leading-relaxed">
                  {currentLesson.description}
                </p>
              </div>

              <div className="border-t border-border-light dark:border-border-dark pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-secondary-light dark:text-secondary-dark">
                      Duration:
                    </span>
                    <p className="font-medium text-primary-light dark:text-primary-dark">
                      {formatDuration(currentLesson.videoLength)} minutes
                    </p>
                  </div>
                  <div>
                    <span className="text-secondary-light dark:text-secondary-dark">
                      Lesson Type:
                    </span>
                    <p className="font-medium text-primary-light dark:text-primary-dark">
                      Video
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-secondary-light dark:text-secondary-dark">
              Select a lesson to view details
            </p>
          )}
        </div>
      ),
    },
    {
      key: "resources",
      label: (
        <span className="flex items-center gap-2">
          <FolderOutlined />
          Resources
        </span>
      ),
      children: (
        <div className="">
          {currentLesson?.link && currentLesson.link.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">
                Lesson Resources
              </h3>
              {currentLesson.link.map((resource, index) => (
                <Link
                  key={index}
                  href={resource.url}
                  target="_blank"
                  className="block p-3 bg-bprimary/5 rounded-lg border border-bprimary/20 hover:bg-bprimary/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileTextOutlined className="text-bprimary" />
                    <div>
                      <h4 className="font-medium text-bprimary">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-secondary-light dark:text-secondary-dark">
                        External Link
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderOutlined className="text-4xl text-secondary-light dark:text-secondary-dark mb-2" />
              <p className="text-secondary-light dark:text-secondary-dark">
                No resources available for this lesson
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "qa",
      label: (
        <span className="flex items-center gap-2">
          <QuestionCircleOutlined />
          Q&A
        </span>
      ),
      children: (
        <div className=" space-y-4">
          <div className="border-b border-border-light dark:border-border-dark pb-4">
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-3">
              Ask a Question
            </h3>
            <TextArea
              rows={3}
              placeholder="Type your question about this lesson..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="mb-4!"
            />
            <Button
              type="primary"
              className="bg-bprimary"
              onClick={handleAddQuestion}
              loading={questionLoading}
              disabled={!questionText.trim() || questionLoading}
              icon={<SendOutlined />}
            >
              Post Question
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-3">
              Questions & Answers
            </h3>
            {currentLesson?.questions && currentLesson.questions.length > 0 ? (
              <div className="max-h-100! overflow-y-auto hide-scrollbar flex flex-col gap-y-4 ">
                {currentLesson.questions.map((question) => (
                  <Card
                    key={question._id}
                    className="border border-border-light dark:border-border-dark max-w-full overflow-x-auto min-h-max!"
                  >
                    <div className="min-w-max!">
                      <div className="flex items-start gap-3">
                        <Avatar
                          src={question.user.avatar?.url}
                          icon={<UserOutlined />}
                          size={40}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-primary-light dark:text-primary-dark">
                              {question.user.name}
                            </span>
                            <span className="text-xs text-secondary-light dark:text-secondary-dark">
                              {new Date(
                                question.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-secondary-light dark:text-secondary-dark">
                            {question.question}
                          </p>
                          <div className="">
                            {replyingTo === question._id ? (
                              <div className="mt-2">
                                <TextArea
                                  rows={2}
                                  placeholder="Type your answer..."
                                  value={answerText}
                                  onChange={(e) =>
                                    setAnswerText(e.target.value)
                                  }
                                />
                                <div className="flex gap-2 mt-3">
                                  <Button
                                    size="small"
                                    type="primary"
                                    className="bg-bprimary"
                                    onClick={() =>
                                      handleAddAnswer(question._id)
                                    }
                                    loading={questionLoading}
                                    disabled={!answerText.trim()}
                                  >
                                    Reply
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setAnswerText("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="small"
                                type="text"
                                icon={<MdReplyAll />}
                                onClick={() => setReplyingTo(question._id)}
                                className={`text-bprimary hidden`}
                              >
                                Reply
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {question.answer && question.answer.length > 0 && (
                        <div className="ml-12 space-y-3">
                          <Divider className="my-2" />
                          {question.answer.map((ans) => (
                            <div
                              key={ans._id}
                              className="flex items-start gap-3"
                            >
                              <Avatar
                                src={ans.user.avatar?.url}
                                icon={<UserOutlined />}
                                size={32}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-primary-light dark:text-primary-dark text-sm">
                                    {ans.user.name}
                                  </span>
                                  <span className="text-xs text-secondary-light dark:text-secondary-dark">
                                    {new Date(
                                      ans.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                  {ans.user.role === "admin" && (
                                    <VscVerifiedFilled className="dark:text-accent text-bprimary" />
                                  )}
                                </div>
                                <p className="text-sm text-secondary-light dark:text-secondary-dark">
                                  {ans.answer}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <QuestionCircleOutlined className="text-4xl text-secondary-light dark:text-secondary-dark mb-2" />
                <p className="text-secondary-light dark:text-secondary-dark">
                  No questions yet. Be the first to ask!
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "reviews",
      label: (
        <span className="flex items-center gap-2">
          <StarOutlined />
          Reviews
        </span>
      ),
      children: (
        <div className=" pb-6">
          {!userReview ? (
            <div className="border-b border-border-light dark:border-border-dark pb-4">
              <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-3">
                Rate this Course
              </h3>
              <div className="flex flex-col gap-y-3">
                <Rate
                  allowHalf
                  value={reviewRating}
                  onChange={setReviewRating}
                />
                <TextArea
                  rows={3}
                  placeholder="Share your experience with this course..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <Button
                  type="primary"
                  className="bg-bprimary max-w-max mt-2 mb-2"
                  onClick={handleAddReview}
                  loading={reviewLoading}
                  disabled={!reviewText.trim() || reviewRating === 0}
                  icon={<SendOutlined />}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          ) : (
            // Show edit review section if user has already reviewed
            <div className="border-b border-border-light dark:border-border-dark pb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">
                  Your Review
                </h3>
                {!isEditingReview && (
                  <Button
                    type="text"
                    onClick={() => setIsEditingReview(true)}
                    className="text-bprimary"
                  >
                    Edit Review
                  </Button>
                )}
              </div>

              {isEditingReview ? (
                <div className="flex flex-col gap-y-3">
                  <Rate value={reviewRating} onChange={setReviewRating} />
                  <TextArea
                    rows={3}
                    placeholder="Update your experience with this course..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="primary"
                      className="bg-bprimary"
                      onClick={handleEditReview}
                      loading={reviewLoading}
                      disabled={!reviewText.trim() || reviewRating === 0}
                      icon={<SendOutlined />}
                    >
                      Update Review
                    </Button>
                    <Button onClick={handleCancelEdit}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                  <Rate disabled value={userReview.rating} className="mb-2" />
                  <p className="text-secondary-light dark:text-secondary-dark">
                    {userReview.comment}
                  </p>
                  <p className="text-xs text-secondary-light dark:text-secondary-dark mt-2">
                    Reviewed on{" "}
                    {new Date(userReview.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-5 mt-4">
              Course Reviews ({reviews.length})
            </h3>
            {reviews.length > 0 ? (
              <div className="flex flex-col gap-y-4">
                {reviews.map((review) => (
                  <Card
                    key={review._id}
                    className="border border-border-light dark:border-border-dark"
                  >
                    <div className="flex flex-col gap-y-4!  ">
                      <div className="flex justify-between">
                        <Rate
                          rootClassName=""
                          disabled
                          value={review.rating}
                          className=""
                          size="small"
                        />
                        <span className="text-xs text-secondary-light dark:text-secondary-dark">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={review.user.avatar?.url}
                          icon={<UserOutlined />}
                          size={40}
                        />
                        <span className="font-medium text-primary-light dark:text-primary-dark">
                          {review.user.name}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col items-center gap-2 mb-1"></div>
                        <p className="text-secondary-light dark:text-secondary-dark">
                          {review.comment}
                        </p>
                      </div>

                      {review.reviewReplies &&
                        review.reviewReplies.length > 0 && (
                          <div className=" space-y-3">
                            <Divider className="my-2" />
                            {review.reviewReplies.map((reply) => (
                              <div
                                key={reply._id}
                                className="flex items-start gap-3"
                              >
                                {reply.user.avatar?.url ? (
                                  <Image
                                    src={reply.user.avatar?.url}
                                    alt="admin-image"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <Avatar icon={<UserOutlined />} size={32} />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 justify-between">
                                    <div className="flex items-center">
                                      <span className="font-medium text-primary-light dark:text-primary-dark text-sm max-w-20 overflow-hidden whitespace-nowrap text-ellipsis">
                                        {reply.user.name}
                                      </span>
                                      <VscVerifiedFilled className="dark:text-accent text-bprimary shrink-0!" />
                                    </div>

                                    <span className="text-xs text-secondary-light dark:text-secondary-dark">
                                      {new Date(
                                        reply.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-secondary-light dark:text-secondary-dark">
                                    {reply?.reply}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      {user?.role === "admin" && (
                        <div className="">
                          {replyingToReview === review._id ? (
                            <div className="space-y-2">
                              <TextArea
                                rows={2}
                                placeholder="Type your reply..."
                                value={reviewReplyText}
                                onChange={(e) =>
                                  setReviewReplyText(e.target.value)
                                }
                              />
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="small"
                                  type="primary"
                                  className="bg-bprimary"
                                  onClick={() =>
                                    handleAddReviewReply(review._id)
                                  }
                                  loading={reviewLoading}
                                  disabled={!reviewReplyText.trim()}
                                >
                                  Reply
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    setReplyingToReview(null);
                                    setReviewReplyText("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="small"
                              type="text"
                              icon={<MdReplyAll />}
                              onClick={() => setReplyingToReview(review._id)}
                              className="text-accent!"
                            >
                              Reply as Admin
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <StarOutlined className="text-4xl text-secondary-light dark:text-secondary-dark mb-2" />
                <p className="text-secondary-light dark:text-secondary-dark">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-body-light dark:bg-body-dark">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="border-border-light dark:border-border-dark"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            Course Content
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
              {currentVideo ? (
                <div className="space-y-0">
                  <div className="aspect-video bg-black">
                    <VideoPlayer demoUrl={currentVideo} />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center p-6 lg:px-10 border-b border-border-light dark:border-border-dark">
                    <Button
                      icon={<LeftOutlined />}
                      onClick={() => navigateToLesson("prev")}
                      disabled={!canNavigatePrev()}
                      className="flex items-center gap-2"
                    >
                      Prev Lesson
                    </Button>
                    <Button
                      icon={<RightOutlined />}
                      iconPosition="end"
                      onClick={() => navigateToLesson("next")}
                      disabled={!canNavigateNext()}
                      className="flex items-center gap-2"
                    >
                      Next Lesson
                    </Button>
                  </div>

                  {/* Current Lesson Title */}
                  {currentLesson && (
                    <div className=" border-b border-border-light dark:border-border-dark  p-6 lg:px-10">
                      <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                        {currentLesson.name}
                      </h2>
                    </div>
                  )}

                  {/* Tabs Section */}
                  <div className="bg-card-light dark:bg-card-dark  p-6 lg:px-10">
                    <Tabs
                      // activeKey={activeTab}
                      // onChange={setActiveTab}
                      defaultActiveKey="1"
                      items={tabItems}
                    />
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <p className="text-secondary-light dark:text-secondary-dark">
                    Select a lesson to start watching
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Course Sections */}
          <div className="lg:col-span-1">
            <div className="bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark">
              <div className="p-4 border-b border-border-light dark:border-border-dark">
                <h3 className="font-semibold text-primary-light dark:text-primary-dark">
                  Course Sections
                </h3>
              </div>
              <div className="p-4">
                <Collapse
                  items={collapseItems}
                  defaultActiveKey={["0"]}
                  ghost
                  styles={{
                    root: {
                      border: "none",
                      marginBottom: "8px",
                    },
                    header: {
                      padding: "12px 0",
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAccess;
