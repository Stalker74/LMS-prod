"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchCoursesApi, GetLayoutDataApi } from "@/app/APIs/routes";
import {
  Button,
  Input,
  Card,
  Rate,
  Pagination,
  Select,
  Tag,
  Spin,
  Empty,
  Space,
  Typography,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { ICourseData } from "@/app/types/apifn.types";
import CourseCard from "@/app/components/CourseCard";
import Lottie from "lottie-react";
import lottieAnimation from '@/public/loader.json'

const { Search } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;

interface Category {
  title: string;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<ICourseData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(12);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<"price" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params
  useEffect(() => {
    const query = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const sort =
      (searchParams.get("sortBy") as "price" | "createdAt") || "createdAt";
    const order = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    setSearchQuery(query);
    setSelectedCategory(category);
    setCurrentPage(page);
    setSortBy(sort);
    setSortOrder(order);
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch courses when filters change
  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchQuery, selectedCategory, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      const response = await GetLayoutDataApi({ type: "category" });
      if (response.data.success) {
        setCategories(response.data.data.category || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchCourses = async () => {
    setSearchLoading(true);
    try {
      const response = await SearchCoursesApi({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        category: selectedCategory,
        sortBy,
        sortOrder,
      });

      if (response.data.success) {
        setCourses(response.data.data.courses);
        setTotalCourses(response.data.data.totalCourses);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const updateURL = useCallback(
    (params: Record<string, string | number>) => {
      const url = new URL(window.location.href);
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value.toString());
        } else {
          url.searchParams.delete(key);
        }
      });
      router.push(url.pathname + url.search);
    },
    [router],
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateURL({
      search: value,
      category: selectedCategory,
      page: 1,
      sortBy,
      sortOrder,
    });
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateURL({
      search: searchQuery,
      category,
      page: 1,
      sortBy,
      sortOrder,
    });
  };

  const handleSort = (field: "price" | "createdAt", order: "asc" | "desc") => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
    updateURL({
      search: searchQuery,
      category: selectedCategory,
      page: 1,
      sortBy: field,
      sortOrder: order,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({
      search: searchQuery,
      category: selectedCategory,
      page,
      sortBy,
      sortOrder,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
    router.push("/courses");
  };

  if (loading) {
    return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-body-light dark:bg-body-dark">
        <div className="text-center">
          <div className="h-80 lg:h-100 mx-auto aspect-square ">
            <Lottie
              animationData={lottieAnimation} 
              loop={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body-light dark:bg-body-dark">
      {/* Hero Section */}
      <div className="bg-bprimary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="mb-4 text-display text-accent">
              Discover Amazing Courses
            </div>
            <div className="text-white/90 text-lg ">
              Find the perfect course to advance your skills and career
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <Search
              placeholder="Search for courses..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchQuery}
              onSearch={handleSearch}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl px-6 lg:px-10 mx-auto my-10 lg:mt-16">
        {/* Filters and Sorting */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <div className={`px-4  rounded-4xl  border max-w-max py-1 text-center text-sm md:text-base ${selectedCategory === '' ? 'text-red-600' : ''} cursor-pointer`} onClick={() => handleCategoryFilter('')}>All</div>
            {categories.map((category) => (
              <div
                className={`px-4 py-1 text-center rounded-4xl  border max-w-max cursor-pointer text-sm md:text-base ${selectedCategory ===category.title ? 'text-red-600' : ''}`}
                onClick={() => handleCategoryFilter(category.title)}
              >
                {category.title}
              </div>
            ))}
          </div>

          <div className="flex justify-end items-center gap-x-4 mt-6">
            <div className="text-primary-light dark:text-primary-dark text-nowrap">
              Sort by:
            </div>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onChange={(value) => {
                const [field, order] = value.split("-") as [
                  "price" | "createdAt",
                  "asc" | "desc",
                ];
                handleSort(field, order);
              }}
              className="w-40"
            >
              <Select.Option value="createdAt-desc">
                <SortDescendingOutlined /> Newest First
              </Select.Option>
              <Select.Option value="createdAt-asc">
                <SortAscendingOutlined /> Oldest First
              </Select.Option>
          /    <Select.Option value="price-asc">
                <SortAscendingOutlined /> Price: Low to High
              </Select.Option>
              <Select.Option value="price-desc">
                <SortDescendingOutlined /> Price: High to Low
              </Select.Option>
            </Select>

            {(searchQuery || selectedCategory) && (
              <Button  onClick={clearFilters}>Clear Filters</Button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <Text className="text-secondary-light dark:text-secondary-dark">
            Showing {courses.length} of {totalCourses} courses
            {searchQuery && <span> for "{searchQuery}"</span>}
            {selectedCategory && <span> in "{selectedCategory}"</span>}
          </Text>
        </div>

        {/* Courses Grid */}
        {searchLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : courses.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {courses.map((course) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={course._id}>
                  <Link href={`/course/${course._id}`}>
                    <CourseCard course={course} />
                  </Link>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <Pagination
                current={currentPage}
                total={totalCourses}
                pageSize={pageSize}
                onChange={handlePageChange} 
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} courses`
                }
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center py-12">
            <Empty
              description={
                <div>
                  <Text className="text-secondary-light dark:text-secondary-dark">
                    {searchQuery || selectedCategory
                      ? "No courses found matching your criteria"
                      : "No courses available"}
                  </Text>
                  {(searchQuery || selectedCategory) && (
                    <div className="mt-4">
                      <Button type="primary" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
