"use client";

import { Button, message, Modal, Rate, Table, TableProps, Tooltip, Empty, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import ReactTimeAgo from "react-time-ago";
import { DeleteCourseApi, GetAllCoursesApi } from "@/app/APIs/routes";
import { ICourseData } from "@/app/types/apifn.types";
import { MdRefresh, MdEdit, MdDelete } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa6";
import axios from "axios";
import { useRouter } from "next/navigation";
import InitialPageloader from "@/app/components/initialPageloader";

try {
  TimeAgo.addDefaultLocale(en);
  TimeAgo.addLocale(ru);
} catch (error) {}

interface DataType {
  key: number;
  _id: string;
  name: string;
  price: number;
  ratings: number;
  createdAt: Date;
  purchased: number;
}

const LiveCoursesPage = () => {
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [courses, setCourses] = useState<ICourseData[]>([]);
  const [rowData, setRowData] = useState<DataType[]>([]);
  const [deleteCourseDialog, setDeleteCourseDialog] = useState(false);
  const [courseTobeDeleted, setCourseTobeDeleted] = useState<{_id:string, name:string}>({_id:'',name:''});
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await GetAllCoursesApi();
      if (res.data.success) {
        setCourses(res.data.data);
        const fieldsData = res.data.data.map((item, i) => ({
          _id: item._id,
          name: item.name,
          key: i,
          purchased: item.purchased,
          price: item.price,
          ratings: item.ratings,
          createdAt: item.createdAt,
        }));
        setRowData(fieldsData);
      }
    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to fetch courses"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Course",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip title={text}>
          <div className="font-medium text-primary-light dark:text-primary-dark line-clamp-2 max-w-48">
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-semibold text-success">
          ${price === 0 ? 'Free' : price}
        </span>
      ),
    },
    {
      title: "Students",
      dataIndex: "purchased",
      key: "purchased",
      render: (purchased) => (
        <span className="font-semibold text-bprimary">
          {purchased || 0}
        </span>
      ),
    },
    {
      title: "Rating",
      dataIndex: "ratings",
      key: "ratings",
      render: (rating) => (
        <div className="flex items-center gap-2">
          <Rate size="small" disabled value={rating || 0} />
        </div>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div>
          <div className="text-sm">
            {new Date(date).toLocaleDateString()}
          </div>
          <div className="text-xs text-muted-light dark:text-muted-dark">
            <ReactTimeAgo date={date} locale="en-US" />
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, {_id, name}) => (
        <div className="flex gap-2">
          <Tooltip title="Edit Course">
            <Button
              type="text"
              size="small"
              icon={<MdEdit />}
              onClick={() => router.push(`/admin/create-courses?edit=${_id}`)}
              className="text-bprimary hover:bg-bprimary/10"
            />
          </Tooltip>
          <Tooltip title="Delete Course">
            <Button
              type="text"
              size="small"
              icon={<MdDelete />}
              onClick={() => {
                setDeleteCourseDialog(true);
                setCourseTobeDeleted({_id, name});
              }}
              className="text-error hover:bg-error/10"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleDeleteCourse = async () => {
    try {
      setDeleteLoading(true);
      const res = await DeleteCourseApi(courseTobeDeleted._id);
      if (res.data.success) {
        messageApi.success('Course deleted successfully');
        setDeleteCourseDialog(false);
        setCourses(res.data.data);
        const fieldsData = res.data.data.map((item, i) => ({
          _id: item._id,
          name: item.name,
          key: i,
          purchased: item.purchased,
          price: item.price,
          ratings: item.ratings,
          createdAt: item.createdAt,
        }));
        setRowData(fieldsData);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data.message || "Failed to delete course"
        );
      }
    } finally {
      setDeleteLoading(false);
      setDeleteCourseDialog(false);
      setCourseTobeDeleted({_id:'', name:''});
    }
  };

  if (loading) {
    return <InitialPageloader />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        {contextHolder}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <FaGraduationCap className="text-2xl text-accent" />
            <h1 className="text-title text-primary-light dark:text-primary-dark">
              Live Courses
            </h1>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-8">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-muted-light dark:text-muted-dark mb-4">
                  Unable to load courses data
                </p>
                <Button 
                  type="primary" 
                  icon={<MdRefresh />}
                  onClick={fetchCourses}
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

  return (
    <div className="space-y-6">
      {contextHolder}
      
      <div className="flex items-start justify-between">
        <div className="flex items-start  gap-3">
          <FaGraduationCap className="text-2xl text-accent" />
          <div>
            <h1 className="text-title text-primary-light dark:text-primary-dark">
              Live Courses
            </h1>
            <p className="text-sm text-muted-light dark:text-muted-dark">
              Manage all published courses
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            icon={<MdRefresh />}
            onClick={fetchCourses}
            loading={loading}
            className="border-bprimary text-bprimary hover:bg-bprimary hover:text-white"
          >
            Refresh
          </Button>
          <Button
            type="primary"
            onClick={() => router.push('/admin/create-courses')}
            className="bg-bprimary hover:bg-bprimary-hover"
          >
            Create Course
          </Button>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg">
        <Table<DataType>
          columns={columns}
          dataSource={rowData}
          loading={loading}
          pagination={{
            total: rowData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
          }}
          scroll={{ x: 800 }}
          className="courses-table"
        />
      </div>

      <Modal
        open={deleteCourseDialog}
        onCancel={() => setDeleteCourseDialog(false)}
        footer={false}
        closeIcon={true}
        title={
          <div className="text-title text-center">
            Delete <span className="text-error">Course</span>
          </div>
        }
        centered={true}
      >
        <div className="flex flex-col mt-4 w-full">
          <div className="text-center mb-2">
            Are you sure you want to delete this course?
          </div>
          <div className="text-center text-accent mb-6 font-medium">
            "{courseTobeDeleted?.name}"
          </div>
          <div className="flex justify-end gap-x-4">
            <Button
              variant="outlined"
              onClick={() => setDeleteCourseDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="red"
              loading={deleteLoading}
              onClick={handleDeleteCourse}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LiveCoursesPage;
