"use client";

import { DeleteNotificationApi, GetNotificationsApi, MarkNotificationAsReadApi } from "@/app/APIs/routes";
import { INotification } from "@/app/types/apifn.types";
import { Button, Empty, message, Popconfirm, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDelete, MdMarkEmailRead, MdMarkEmailUnread } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import InitialPageloader from "@/app/components/initialPageloader";

try {
  TimeAgo.addDefaultLocale(en);
  TimeAgo.addLocale(ru);
} catch (error) {}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await GetNotificationsApi();
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to fetch notifications"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setActionLoading(id);
      const response = await MarkNotificationAsReadApi(id);
      if (response.data.success) {
        setNotifications(response.data.data);
        messageApi.success("Notification marked as read");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to mark notification as read"
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setActionLoading(id);
      const response = await DeleteNotificationApi(id);
      if (response.data.success) {
        setNotifications(response.data.data);
        messageApi.success("Notification deleted successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.data?.message || "Failed to delete notification"
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  if (loading) {
    return (
      <InitialPageloader />
    );
  }

  return (
    <div className="space-y-6 min-w-max">
      {contextHolder}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IoNotifications className="text-2xl text-accent" />
          <h1 className="text-title text-primary-light dark:text-primary-dark">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="bg-error text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        <Button 
          onClick={fetchNotifications}
          className="border-bprimary text-bprimary hover:bg-bprimary hover:text-white"
        >
          Refresh
        </Button>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-8">
          <Empty
            description={
              <span className="text-muted-light dark:text-muted-dark">
                No notifications found
              </span>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-card-light dark:bg-card-dark border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                notification.status === 'unread'
                  ? 'border-bprimary bg-bprimary-soft dark:bg-bprimary/10'
                  : 'border-border-light dark:border-border-dark'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-primary-light dark:text-primary-dark line-clamp-1">
                      {notification.title}
                    </h3>
                    {notification.status === 'unread' && (
                      <span className="w-2 h-2 bg-bprimary rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-secondary-light dark:text-secondary-dark text-sm mb-3 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="text-xs text-muted-light dark:text-muted-dark">
                    <ReactTimeAgo date={new Date(notification.createdAt)} locale="en-US" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {notification.status === 'unread' && (
                    <Tooltip title="Mark as read">
                      <Button
                        type="text"
                        size="small"
                        icon={<MdMarkEmailRead />}
                        loading={actionLoading === notification._id}
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-success hover:bg-success/10"
                      />
                    </Tooltip>
                  )}
                  
                  <Popconfirm
                    title="Delete notification"
                    description="Are you sure you want to delete this notification?"
                    onConfirm={() => handleDelete(notification._id)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Tooltip title="Delete">
                      <Button
                        type="text"
                        size="small"
                        icon={<MdDelete />}
                        loading={actionLoading === notification._id}
                        className="text-error hover:bg-error/10"
                      />
                    </Tooltip>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
