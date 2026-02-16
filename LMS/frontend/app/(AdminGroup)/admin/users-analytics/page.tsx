"use client";

import { GetUsersAnalyticsApi } from "@/app/APIs/routes";
import { message, Button, Empty } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MdRefresh } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import InitialPageloader from "@/app/components/initialPageloader";

const UsersAnalyticsPage = () => {
  const [usersAnalytics, setUsersAnalytics] = useState<{ count: number; month: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await GetUsersAnalyticsApi();
      if (res.data.success) {
        setUsersAnalytics(res.data.data);
      }
    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to fetch users analytics"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <InitialPageloader />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        {contextHolder}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <FaUsers className="text-2xl text-accent" />
            <h1 className="text-title text-primary-light dark:text-primary-dark">
              Users Analytics
            </h1>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-8">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-muted-light dark:text-muted-dark mb-4">
                  Unable to load analytics data
                </p>
                <Button 
                  type="primary" 
                  icon={<MdRefresh />}
                  onClick={fetchAnalytics}
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

  const totalUsers = usersAnalytics.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {contextHolder}
      
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <FaUsers className="text-2xl text-accent" />
          <div>
            <h1 className="text-title text-primary-light dark:text-primary-dark">
              Users Analytics
            </h1>
            <p className="text-sm text-muted-light dark:text-muted-dark">
              Track user registration trends over time
            </p>
          </div>
        </div>
        
        <Button
          icon={<MdRefresh />}
          onClick={fetchAnalytics}
          loading={loading}
          className="border-bprimary text-bprimary hover:bg-bprimary hover:text-white"
        >
          Refresh
        </Button>
      </div>

      {/* Stats Card */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-bprimary mb-2">{totalUsers}</div>
          <div className="text-muted-light dark:text-muted-dark">Total Users Registered</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-6">
          Monthly User Registration Trends
        </h3>
        
        {usersAnalytics.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No analytics data available"
            />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={usersAnalytics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <Tooltip 
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
                name="Users Registered"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default UsersAnalyticsPage;
