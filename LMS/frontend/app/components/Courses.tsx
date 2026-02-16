"use client";

import React, { useEffect, useState } from 'react'
import CourseCard from './CourseCard'
import { GetCoursesApi } from '../APIs/routes'
import { ICourseData } from '../types/apifn.types'
import { message, Skeleton, Empty, Button, Rate } from 'antd'
import { useRouter } from 'next/navigation'
import CardSkeleton from './CardSkeleton';


const Courses = () => {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<ICourseData[]>([])
  const [error, setError] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const router = useRouter()

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(false)
      const res = await GetCoursesApi()
      if (res.data.success) {
        setCourses(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      setError(true)
      messageApi.error('Failed to load courses. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRetry = () => {
    fetchData()
  }

  if (loading) {
    return (
      <div>
        <div className='text-display text-center mb-10 lg:mb-16'>
          Upgrade Your <span className='text-accent'>Skills</span>
        </div>
        
        {/* Skeleton Loading */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array(6).fill(0).map((_, i) => (
            <div key={i}>
              <CardSkeleton />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className='text-display text-center mb-10 lg:mb-16'>
          Upgrade Your <span className='text-accent'>Skills</span>
        </div>
        
        {/* Error State */}
        <div className="flex flex-col items-center justify-center py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-muted-light dark:text-muted-dark mb-4">
                  Unable to load courses at the moment
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
    )
  }

  if (courses.length === 0) {
    return (
      <div>
        <div className='text-display text-center mb-10 lg:mb-16'>
          Upgrade Your <span className='text-accent'>Skills</span>
        </div>
        
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-12">
          <Empty
            description={
              <div className="text-center">
                <p className="text-muted-light dark:text-muted-dark mb-4">
                  No courses available at the moment
                </p>
                <p className="text-sm text-muted-light dark:text-muted-dark">
                  Check back soon for exciting new courses!
                </p>
              </div>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      {contextHolder}
      <div className='text-display text-center mb-10 lg:mb-16'>
        Upgrade Your <span className='text-accent'>Skills</span>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {courses.map((item, i) => (
          <div 
            key={item._id || i} 
            onClick={() => router.push(`/course/${item._id}`)}
            className="cursor-pointer"
          >
            <CourseCard course={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Courses
