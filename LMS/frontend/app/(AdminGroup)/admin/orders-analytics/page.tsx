"use client";

import { GetOrdersAnalyticsApi } from "@/app/APIs/routes";
import { message, Button, Empty } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MdRefresh } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import InitialPageloader from "@/app/components/initialPageloader";

const OrdersAnalyticsPage = () => {
  const [orderAnalytics, setOrderAnalytics] = useState<{ count: number; month: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await GetOrdersAnalyticsApi();
      if (res.data.success) {
        setOrderAnalytics(res.data.data);
      }
    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to fetch orders analytics"
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
            <FaShoppingCart className="text-2xl text-accent" />
            <h1 className="text-title text-primary-light dark:text-primary-dark">
              Orders Analytics
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

  const totalOrders = orderAnalytics.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {contextHolder}
      
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <FaShoppingCart className="text-2xl text-accent" />
          <div>
            <h1 className="text-title text-primary-light dark:text-primary-dark">
              Orders Analytics
            </h1>
            <p className="text-sm text-muted-light dark:text-muted-dark">
              Track order trends and sales performance
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
          <div className="text-3xl font-bold text-bprimary mb-2">{totalOrders}</div>
          <div className="text-muted-light dark:text-muted-dark">Total Orders Placed</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-6">
          Monthly Order Trends
        </h3>
        
        {orderAnalytics.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No analytics data available"
            />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={orderAnalytics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <Line
                type="monotone"
                dataKey="count"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
                name="Orders Placed"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default OrdersAnalyticsPage;
