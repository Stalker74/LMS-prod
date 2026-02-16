"use client";

import React, { useEffect, useState } from 'react';
import { GetEnrolledCoursesApi } from '@/app/APIs/routes';
import { ICourseData } from '@/app/types/apifn.types';
import { message, Empty, Button } from 'antd';
import { useRouter } from 'next/navigation';
import CourseCard from '../CourseCard';
import CardSkeleton from '../CardSkeleton';
import axios from 'axios';

const EnrolledCourses = () => {
  const [courses, setCourses] = useState<ICourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await GetEnrolledCoursesApi();
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
      setError(true);
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || 'Failed to load enrolled courses'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const handleRetry = () => {
    fetchEnrolledCourses();
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/course-access/${courseId}`);
  };

  if (loading) {
    return (
      <div className="w-full p-6">
        {contextHolder}
        <h2 className="text-title text-primary-light dark:text-primary-dark mb-6">
          My Enrolled Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        {contextHolder}
        <h2 className="text-title text-primary-light dark:text-primary-dark mb-6">
          My Enrolled Courses
        </h2>
        <div className="flex flex-col items-center justify-center py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-muted-light dark:text-muted-dark mb-4">
                  Unable to load your enrolled courses
                </p>
                <Button 
                  type="primary" 
                  onClick={handleRetry}
                  className="bg-bprimary hover:bg-bprimary-hover"
                >
                  Try Again
                </Button>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="w-full p-6">
        {contextHolder}
        <h2 className="text-title text-primary-light dark:text-primary-dark mb-6">
          My Enrolled Courses
        </h2>
        <div className="flex flex-col items-center justify-center py-12">
          <Empty
            description={
              <div className="text-center">
                <p className="text-muted-light dark:text-muted-dark mb-4">
                  You haven't enrolled in any courses yet
                </p>
                <p className="text-sm text-muted-light dark:text-muted-dark mb-6">
                  Explore our course catalog and start your learning journey!
                </p>
                <Button 
                  type="primary" 
                  onClick={() => router.push('/courses')}
                  className="bg-bprimary hover:bg-bprimary-hover"
                >
                  Browse Courses
                </Button>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:p-6">
      {contextHolder}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-title text-primary-light dark:text-primary-dark">
          My Enrolled Courses
        </h2>
        <span className="text-sm text-muted-light dark:text-muted-dark">
          {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div 
            key={course._id} 
            onClick={() => handleCourseClick(course._id)}
            className="cursor-pointer"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;
