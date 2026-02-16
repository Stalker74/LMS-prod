"use client";

import { GetAllReviewsApi } from "@/app/APIs/routes";
import { Rate, Skeleton } from "antd";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";

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
  courseName: string;
  courseId: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await GetAllReviewsApi();
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Fallback reviews for when API fails or no reviews exist
  const fallbackReviews = [
    {
      _id: "fallback-1",
      user: {
        _id: "user-1",
        name: "Sarah Johnson",
        avatar: {
          url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww",
        },
        role: "student",
      },
      comment:
        "Amazing courses! The instructors are knowledgeable and the content is well-structured. I've learned so much and feel confident in my new skills.",
      rating: 5,
      createdAt: new Date("2024-01-15"),
      courseName: "Web Development Bootcamp",
      courseId: "course-1",
    },
    {
      _id: "fallback-2",
      user: {
        _id: "user-2",
        name: "Michael Chen",
        avatar: {
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww",
        },
        role: "student",
      },
      comment:
        "Excellent learning platform with practical projects. The support from instructors is outstanding and helped me land my dream job!",
      rating: 5,
      createdAt: new Date("2024-01-10"),
      courseName: "Data Science Fundamentals",
      courseId: "course-2",
    },
    {
      _id: "fallback-3",
      user: {
        _id: "user-3",
        name: "Emily Rodriguez",
        avatar: {
          url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww",
        },
        role: "student",
      },
      comment:
        "Great value for money! The courses are comprehensive and up-to-date with industry standards. Highly recommend to anyone looking to upskill.",
      rating: 4,
      createdAt: new Date("2024-01-08"),
      courseName: "Mobile App Development",
      courseId: "course-3",
    },
    {
      _id: "fallback-4",
      user: {
        _id: "user-4",
        name: "David Thompson",
        avatar: {
          url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww",
        },
        role: "student",
      },
      comment:
        "The interactive learning approach makes complex topics easy to understand. The community support is also fantastic!",
      rating: 5,
      createdAt: new Date("2024-01-05"),
      courseName: "Machine Learning Basics",
      courseId: "course-4",
    },
    {
      _id: "fallback-5",
      user: {
        _id: "user-5",
        name: "Lisa Wang",
        avatar: {
          url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww",
        },
        role: "student",
      },
      comment:
        "Professional quality content with real-world applications. The certification has definitely boosted my career prospects.",
      rating: 4,
      createdAt: new Date("2024-01-03"),
      courseName: "Digital Marketing Mastery",
      courseId: "course-5",
    },
    {
      _id: "fallback-6",
      user: {
        _id: "user-6",
        name: "James Wilson",
        avatar: {
          url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww",
        },
        role: "student",
      },
      comment:
        "Flexible learning schedule that fits perfectly with my work. The quality of instruction is top-notch and very engaging.",
      rating: 5,
      createdAt: new Date("2024-01-01"),
      courseName: "Cloud Computing Essentials",
      courseId: "course-6",
    },
  ];

  const displayReviews =
    error || reviews.length === 0 ? fallbackReviews : reviews.slice(0, 6);

  if (loading) {
    return (
      <div className="mt-8">
        <div className="mb-16 lg:mb-20">
          <div className="text-display text-center">
            Real Stories, <span className="text-accent">Real Results</span>
          </div>
          <div className="text-center text-title font-medium text-bprimary">
            Hear how our courses helped students launch their careers.
          </div>
        </div>

        {/* Skeleton Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="dark:bg-card-dark bg-card-light border border-border-light dark:border-border-dark rounded-lg p-4 md:p-6"
              >
                <div className="flex flex-col gap-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton.Avatar size={64} />

                    <div className="min-w-max">
                      <Rate value={0} disabled/>
                    </div>
                     
                    </div>
                  </div>

                  <Skeleton.Input
                    style={{ width: "100%", height: 70 }}
                    active
                    className="w-full!"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-16 lg:mb-20">
        <div className="text-display text-center">
          Real Stories, <span className="text-accent">Real Results</span>
        </div>
        <div className="text-center text-title font-medium text-bprimary">
          Hear how our courses helped students launch their careers.
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {displayReviews.map((review, index) => (
          <ReviewCard key={review._id || `fallback-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
};

// interface ReviewCardProps {
//   review: Review;
// }

// const ReviewCard = ({ review }: ReviewCardProps) => {
//   const [imageError, setImageError] = useState(false);

//   const defaultImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww";

//   const displayImage = imageError || !review.user?.avatar?.url ? defaultImage : review.user.avatar.url;

//   const formatDate = (date: Date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="dark:bg-card-dark bg-card-light w-full border border-border-light dark:border-border-dark px-4 md:px-6 py-4 md:py-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-y-3 rounded-md md:rounded-lg">
//       <div className="flex justify-between items-start">
//         <div className="flex items-center gap-x-3">
//           <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0">
//             <Image
//               src={displayImage}
//               alt={review.user?.name || "User"}
//               fill
//               className="rounded-full object-cover"
//               onError={() => setImageError(true)}
//             />
//           </div>
//           <div className="min-w-0 flex-1">
//             <div className="font-bold leading-tight text-primary-light dark:text-primary-dark line-clamp-1">
//               {review.user?.name || "Anonymous User"}
//             </div>
//             {review.courseName && (
//               <div className="text-xs text-muted-light dark:text-muted-dark line-clamp-1 mt-1">
//                 {review.courseName}
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="text-right">
//           <Rate value={review.rating} disabled size="small" />
//           <div className="text-muted-light dark:text-muted-dark text-xs md:text-sm mt-1">
//             {formatDate(review.createdAt)}
//           </div>
//         </div>
//       </div>
//       <div className="text-sm md:text-base text-secondary-light dark:text-secondary-dark leading-relaxed">
//         {review.comment}
//       </div>
//     </div>
//   );
// };

export default Reviews;
