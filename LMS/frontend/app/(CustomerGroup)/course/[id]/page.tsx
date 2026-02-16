"use client";
import React, { useEffect, useState } from "react";
import {
  CreateCheckoutSessionApi,
  GetProfileData,
  GetSingleCourseApi,
} from "@/app/APIs/routes";
import { ICourseData, IUser } from "@/app/types/apifn.types";
import { Rate, Button, Spin, Collapse, message } from "antd";
import {
  FaPlay,
  FaCheck,
  FaClock,
  FaUsers,
  FaCertificate,
  FaLifeRing,
} from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import ReviewCard from "@/app/components/ReviewCard";

const { Panel } = Collapse;
import VideoPlayer from "@/app/components/AdminComponents/VideoPlayer";
import { useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import InitialPageloader from "@/app/components/initialPageloader";

const CourseDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const [courseId, setCourseId] = useState<string>("");
  const [course, setCourse] = useState<ICourseData | null>(null);
  const [loading, setLoading] = useState(false);
  const { user }: { user: IUser } = useSelector(
    (state: any) => state.UserReducer
  );
  const [isEnrolled, setisEnrolled] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      const userData = await GetProfileData()
      if(userData.data.success)
      setCourseId(resolvedParams.id);
      setisEnrolled(userData.data.data.courses.includes(resolvedParams.id) || user.courses.includes(resolvedParams.id));
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!courseId) return;

    const getCourseData = async () => {
      try {
        setLoading(true);
        const response = await GetSingleCourseApi(courseId);
        setCourse(response.data.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    getCourseData();
  }, [courseId]);

  if (loading) {
    return (
      <InitialPageloader />
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark">
        <div className="text-primary-light dark:text-primary-dark">
          Course not found
        </div>
      </div>
    );
  }

  const discountPercentage =
    course.estimatedPrice > 0
      ? Math.round(
          ((course.estimatedPrice - course.price) / course.estimatedPrice) * 100
        )
      : 0;

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const res = await CreateCheckoutSessionApi({
        courseId: courseId,
        userEmail: user?.email,
        userId: user?._id,
      });
      if (res.data.success) {
        router.push(res.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return messageApi.error(
          error.response?.data?.message || "Failed to create Checkout Session"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-body-light dark:bg-body-dark">
      {contextHolder}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="bg-bprimary rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4">
                {course.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4 justify-between">
                <div className="flex items-center gap-4">
                  <Rate disabled value={course.ratings} size="small" />
                  <span className="text-secondary-dark">
                    {course.reviews?.length || 0} Reviews
                  </span>
                </div>
                <span className="text-accent ">
                  {course.purchased} Students
                </span>
              </div>
            </div>

            {/* What you will learn */}
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                What you will learn from this course?
              </h2>
              <div className="space-y-3">
                {course.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FaCheck className="text-success mt-1 shrink-0" size={16} />
                    <span className="text-secondary-light dark:text-secondary-dark">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                What are the prerequisites for starting this course?
              </h2>
              <div className="space-y-3">
                {course.preRequisits?.map((prerequisite, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FaCheck className="text-success mt-1 shrink-0" size={16} />
                    <span className="text-secondary-light dark:text-secondary-dark">
                      {prerequisite}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Overview */}
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                Course Overview
              </h2>
              <Collapse className="bg-transparent" accordion>
                {course.courseData?.map((section, sectionIndex) => (
                  <Panel
                    key={sectionIndex}
                    header={
                      <div className="flex items-start gap-6">
                        <span className="font-medium text-bprimary">
                          {section.sectionName}
                        </span>
                        <span className="text-xs md:text-sm text-nowrap mt-1 md:mt-0  text-accent">
                          ({section.data?.length || 0} Videos)
                        </span>
                      </div>
                    }
                    className="border-b border-border-light dark:border-border-dark last:border-b-0"
                  >
                    <div className="space-y-3 pt-2  max-h-60 lg:max-h-72 overflow-y-auto ">
                      {section.data?.map((lesson, lessonIndex) => (
                        <div
                          key={lessonIndex}
                          className="p-6 rounded-lg bg-section-light dark:bg-section-dark flex flex-col gap-y-2"
                        >
                          <div className="flex items-start gap-3 md:gap-4">
                            <MdOutlineOndemandVideo
                              className="text-bprimary mt-0.5"
                              size={20}
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-primary-light dark:text-primary-dark">
                                {lesson.name}
                              </h3>
                            </div>
                            <span className="text-sm text-success">
                              {lesson.videoLength} min
                            </span>
                          </div>
                          <p className="text-sm text-muted-light dark:text-muted-dark">
                            {lesson.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </div>

            {/* Course Details */}
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                Course Details
              </h2>
              <p className="text-secondary-light dark:text-secondary-dark leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Video Preview */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
                <div className="relative aspect-video bg-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <VideoPlayer demoUrl={course?.demoUrl} />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
                {isEnrolled ? (
                  <span className="text-3xl font-bold text-primary-light dark:text-primary-dark ">
                    Enrolled
                  </span>
                ) : (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-primary-light dark:text-primary-dark">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    {course.estimatedPrice > 0 && (
                      <>
                        <span className="text-lg line-through text-muted-light dark:text-muted-dark">
                          ${course.estimatedPrice}
                        </span>
                        <span className="bg-success text-white px-2 py-1 rounded text-sm">
                          {discountPercentage}% Off
                        </span>
                      </>
                    )}
                  </div>
                )}
                {isEnrolled ? (
                  <Button
                    type="primary"
                    size="large"
                    block
                    className="w-full border-none mb-4 mt-2"
                    onClick={()=>router.push(`/course-access/${courseId}`)}
                  >
                    Get Into Course
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    block
                    className="w-full border-none mb-4"
                    onClick={handlePurchase}
                    loading={loading}

                  >
                    Buy Now
                  </Button>
                )}

                {/* Course Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-secondary-light dark:text-secondary-dark">
                    <FaClock className="text-bprimary" />
                    <span>Source code included</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-light dark:text-secondary-dark">
                    <FaUsers className="text-bprimary" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-light dark:text-secondary-dark">
                    <FaCertificate className="text-bprimary" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-light dark:text-secondary-dark">
                    <FaLifeRing className="text-bprimary" />
                    <span>Premium Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        {course.reviews && (
          <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark mt-10">
            <h2 className="text-xl font-semibold text-accent mb-6 ">
              Student Reviews ({course.reviews.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {course.reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
