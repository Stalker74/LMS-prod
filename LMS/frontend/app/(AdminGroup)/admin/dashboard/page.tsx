"use client";

import {
  GetAllOrders,
  GetOrdersAnalyticsApi,
  GetUsersAnalyticsApi,
} from "@/app/APIs/routes";
import { message, Table, TableProps, Tooltip, Button, Empty, Card, Statistic } from "antd";
import axios from "axios";
import TimeAgo from "javascript-time-ago";
import React, { useEffect, useState } from "react";
import { MdOutlineMailOutline, MdOutlineSell, MdRefresh, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import ReactTimeAgo from "react-time-ago";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import { FaUsers, FaDollarSign, FaChartLine } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import InitialPageloader from "@/app/components/initialPageloader";

try {
  TimeAgo.addDefaultLocale(en);
  TimeAgo.addLocale(ru);
} catch (error) {}

interface DataType {
  _id: string;
  name: string;
  email: string;
  price: string;
  createdAt: Date;
  key: number;
  CourseName: string;
}

interface AnalyticsData {
  count: number;
  month: string;
}

const Dashboard = () => {
  const [usersAnalytics, setUsersAnalytics] = useState<AnalyticsData[]>([]);
  const [ordersAnalytics, setOrdersAnalytics] = useState<AnalyticsData[]>([]);
  const [rowData, setRowData] = useState<DataType[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usersError, setUsersError] = useState(false);
  const [ordersError, setOrdersError] = useState(false);
  const [transactionsError, setTransactionsError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setUsersError(false);
      setOrdersError(false);
      setTransactionsError(false);

      // Fetch all data concurrently but handle errors individually
      const [usersRes, ordersAnaRes, ordersRes] = await Promise.allSettled([
        GetUsersAnalyticsApi(),
        GetOrdersAnalyticsApi(),
        GetAllOrders(),
      ]);

      // Handle Users Analytics
      if (usersRes.status === 'fulfilled' && usersRes.value.data.success) {
        setUsersAnalytics(usersRes.value.data.data);
        const users = usersRes.value.data.data.reduce(
          (acc: number, current: AnalyticsData) => acc + current.count,
          0
        );
        setTotalUsers(users);
      } else {
        setUsersError(true);
        setUsersAnalytics([]);
      }

      // Handle Orders Analytics
      if (ordersAnaRes.status === 'fulfilled' && ordersAnaRes.value.data.success) {
        setOrdersAnalytics(ordersAnaRes.value.data.data);
        const orders = ordersAnaRes.value.data.data.reduce(
          (acc: number, current: AnalyticsData) => acc + current.count,
          0
        );
        setTotalOrders(orders);
      } else {
        setOrdersError(true);
        setOrdersAnalytics([]);
      }

      // Handle Recent Transactions
      if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
        const data = ordersRes.value.data.data.map((item: any, i: number) => ({
          key: i,
          name: item?.userId?.name || 'N/A',
          email: item?.userId?.email || 'N/A',
          price: item?.courseId?.price || '0',
          CourseName: item?.courseId?.name || 'N/A',
          createdAt: item?.createdAt,
          _id: item._id,
        }));
        setRowData(data);
        
        // Calculate total revenue
        const revenue = data.reduce((sum: number, item: DataType) => 
          sum + (parseFloat(item.price) || 0), 0
        );
        setTotalRevenue(revenue);
      } else {
        setTransactionsError(true);
        setRowData([]);
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to load dashboard data"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Customer",
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
      title: "Course",
      dataIndex: "CourseName",
      key: "CourseName",
      render: (text) => (
        <Tooltip title={text}>
          <div className="max-w-36 line-clamp-2 text-sm">
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Amount",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-semibold text-success">
          ${price === '0' ? 'Free' : price}
        </span>
      ),
    },
    {
      title: "Date",
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
      title: "Action",
      key: "actions",
      render: (_, { email }) => (
        <Tooltip title="Send Email">
          <Button
            type="text"
            size="small"
            icon={<MdOutlineMailOutline />}
            onClick={() => {
              window.location.href = `mailto:${email}`;
            }}
            className="text-bprimary hover:bg-bprimary/10"
          />
        </Tooltip>
      ),
    },
  ];

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    trend, 
    loading: cardLoading 
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: { value: number; isPositive: boolean };
    loading?: boolean;
  }) => (
    <Card className="border border-border-light dark:border-border-dark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-light dark:text-muted-dark mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>
            {cardLoading ? '...' : value}
          </p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs mt-1 ${
              trend.isPositive ? 'text-success' : 'text-error'
            }`}>
              {trend.isPositive ? <MdTrendingUp /> : <MdTrendingDown />}
              {trend.value}% from last month
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')}/10`}>
          {icon}
        </div>
      </div>
    </Card>
  );

  const ChartErrorFallback = ({ title, onRetry }: { title: string; onRetry: () => void }) => (
    <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6">
      <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-4">
        {title}
      </h3>
      <div className="flex flex-col items-center justify-center py-12">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-center">
              <p className="text-muted-light dark:text-muted-dark mb-4">
                Unable to load chart data
              </p>
              <Button 
                type="primary" 
                icon={<MdRefresh />}
                onClick={onRetry}
                className="bg-bprimary hover:bg-bprimary-hover"
              >
                Retry
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );

  if (loading) {
    return <InitialPageloader />;
  }

  return (
    <div className="space-y-6">
      {contextHolder}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-primary-light dark:text-primary-dark">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-light dark:text-muted-dark">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <Button
          icon={<MdRefresh />}
          onClick={fetchDashboardData}
          loading={loading}
          className="border-bprimary text-bprimary hover:bg-bprimary hover:text-white"
        >
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={<FaUsers size={24} />}
          color="text-bprimary"
          trend={{ value: 12, isPositive: true }}
          loading={usersError}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={<MdOutlineSell size={24} />}
          color="text-success"
          trend={{ value: 8, isPositive: true }}
          loading={ordersError}
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<FaDollarSign size={24} />}
          color="text-accent"
          trend={{ value: 15, isPositive: true }}
          loading={transactionsError}
        />
        <StatCard
          title="Avg. Order Value"
          value={`$${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0'}`}
          icon={<FaChartLine size={24} />}
          color="text-info"
          trend={{ value: 3, isPositive: false }}
          loading={ordersError || transactionsError}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Analytics Chart */}
        {usersError ? (
          <ChartErrorFallback 
            title="Users Analytics" 
            onRetry={fetchDashboardData}
          />
        ) : (
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-4">
              Users Analytics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usersAnalytics}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="currentColor"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="currentColor"
                />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card-light)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Orders Analytics Chart */}
        {ordersError ? (
          <ChartErrorFallback 
            title="Orders Analytics" 
            onRetry={fetchDashboardData}
          />
        ) : (
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-4">
              Orders Analytics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersAnalytics}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="currentColor"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="currentColor"
                />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card-light)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">
            Recent Transactions
          </h3>
          <Button 
            type="link" 
            href="/admin/invoices"
            className="text-bprimary"
          >
            View All
          </Button>
        </div>
        
        {transactionsError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <p className="text-muted-light dark:text-muted-dark mb-4">
                    Unable to load transactions
                  </p>
                  <Button 
                    type="primary" 
                    icon={<MdRefresh />}
                    onClick={fetchDashboardData}
                    className="bg-bprimary hover:bg-bprimary-hover"
                  >
                    Retry
                  </Button>
                </div>
              }
            />
          </div>
        ) : (
          <Table<DataType>
            columns={columns}
            dataSource={rowData.slice(0, 5)}
            pagination={false}
            scroll={{ x: 600 }}
            className="dashboard-table"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
