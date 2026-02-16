"use client";

import React, { useState } from "react";
import { ICourseData } from "../types/apifn.types";
import Image from "next/image";
import { Rate } from "antd";
import { useSelector } from "react-redux";
import { VscThreeBars } from "react-icons/vsc";

const CourseCard = ({ course }: { course: ICourseData }) => {
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [imageError, setImageError] = useState(false);
  
  const fallbackImage = "/placeholder-course.jpg";
  const displayImage = imageError || !course.thumbnail?.url ? fallbackImage : course.thumbnail.url;
  
  const totalLessons = course.courseData?.reduce((total, section) => total + (section.data?.length || 0), 0) || 0;

  return (
    <div className="rounded-lg border border-border-light dark:border-border-dark cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative w-full h-50 rounded-lg overflow-hidden">
        <Image
          src={displayImage}
          alt={course?.name || "Course"}
          fill
          className="object-cover rounded-t-lg"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-6 flex flex-col bg-card-light dark:bg-card-dark dark:text-secondary-dark text-secondary-light">
        <div className="w-full flex justify-center">
          <Rate
            size={'small'}
            disabled
            value={course.ratings || 0}
          />
        </div>
        <div className="text-center my-2 text-lg font-bold max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
          {course.name || "Untitled Course"}
        </div>
        <div className="flex justify-between pt-2 pb-2 items-center">
          <div className="flex gap-x-1 lg:gap-x-2 items-center">
            <span className="text-3xl font-bold">
              {course.price === 0 ? "Free" : `$${course.price || 0}`}
            </span>
            {course.estimatedPrice && course.estimatedPrice !== 0 && (
              <span className="text-lg line-through text-muted-light dark:text-muted-dark">
                ${course.estimatedPrice}
              </span>
            )}
          </div>
          <div>{course.purchased || 0} Enrolled</div>
        </div>
        <div className="flex justify-between">
          <div className="capitalize text-bprimary">{course.level || "Beginner"}</div>
          <div className="flex items-center gap-x-1">
            <VscThreeBars size={25} color="#f59e0b"/>
            <span>{totalLessons} Lessons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
