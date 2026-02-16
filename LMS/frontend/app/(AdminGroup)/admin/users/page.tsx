"use client";

import { Button, message, Table, TableProps, Tooltip, Empty, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import ReactTimeAgo from "react-time-ago";
import { GetAllUsers } from "@/app/APIs/routes";
import { IUser } from "@/app/types/apifn.types";
import { MdDeleteOutline, MdOutlineEmail, MdRefresh } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import axios from "axios";
import InitialPageloader from "@/app/components/initialPageloader";

// try {
//   TimeAgo.addLocale(en);
//   TimeAgo.addLocale(ru);
// } catch (error) {}

interface DataType {
  key: number;
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  courses: string[];
}

const UsersPage = () => {
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [users, setUsers] = useState<IUser[]>([]);
  const [rowData, setRowData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await GetAllUsers();
      if (res.data.success) {
        setUsers(res.data.data);
        const fieldsData = res.data.data.map((item, i) => ({
          key: i,
          _id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          createdAt: item.createdAt,
          courses: item.courses,
        }));
        setRowData(fieldsData);
      }
    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to fetch users"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <Tooltip title={text}>
            <div className="font-medium text-primary-light dark:text-primary-dark line-clamp-1 max-w-32">
              {text}
            </div>
          </Tooltip>
          <div className="text-xs text-muted-light dark:text-muted-dark line-clamp-1 max-w-32">
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'} className="font-medium">
          {role || 'user'}
        </Tag>
      ),
    },
    {
      title: "Enrolled Courses",
      dataIndex: "courses",
      key: "courses",
      render: (courses) => (
        <span className="font-semibold text-bprimary">
          {courses?.length || 0} courses
        </span>
      ),
    },
    {
      title: "Registered",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => 
      {
        console.log('date is',date)
        const d = new Date(date)
        console.log('dateee',d)
       return (
        <div>
          <div className="text-sm">
            {new Date(date).toLocaleDateString()}
          </div>
          
          <div className="text-xs text-muted-light dark:text-muted-dark">
            {/* <ReactTimeAgo date={date} locale="en-US" /> */}
          </div>
          
        </div>
      )
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, { email }) => (
        <div className="flex gap-2">
          <Tooltip title="Send Email">
            <Button
              type="text"
              size="small"
              icon={<MdOutlineEmail />}
              onClick={() => window.location.href = `mailto:${email}`}
              className="text-success hover:bg-success/10"
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Button
              type="text"
              size="small"
              icon={<MdDeleteOutline />}
              className="text-error hover:bg-error/10"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (loading) {
    return <InitialPageloader />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        {contextHolder}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUsers className="text-2xl text-accent" />
            <h1 className="text-title text-primary-light dark:text-primary-dark">
              Users Management
            </h1>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-8">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-muted-light dark:text-muted-dark mb-4">
                  Unable to load users data
                </p>
                <Button 
                  type="primary" 
                  icon={<MdRefresh />}
                  onClick={fetchUsers}
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
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaUsers className="text-2xl text-accent" />
          <div>
            <h1 className="text-title text-primary-light dark:text-primary-dark">
              Users Management
            </h1>
            <p className="text-sm text-muted-light dark:text-muted-dark">
              Manage platform users and their roles
            </p>
          </div>
        </div>
        
        <Button
          icon={<MdRefresh />}
          onClick={fetchUsers}
          loading={loading}
          className="border-bprimary text-bprimary hover:bg-bprimary hover:text-white"
        >
          Refresh
        </Button>
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
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          scroll={{ x: 800 }}
          className="users-table"
        />
      </div>
    </div>
  );
};

export default UsersPage;
