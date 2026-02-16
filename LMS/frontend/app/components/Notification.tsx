"use client";

import {
  DeleteNotificationApi,
  GetNotificationsApi,
  MarkNotificationAsReadApi,
} from "@/app/APIs/routes";
import { INotification } from "@/app/types/apifn.types";
import { socket } from "@/socketio";
import {
  Button,
  Dropdown,
  Empty,
  MenuProps,
  message,
  Popconfirm,
  Spin,
  Tooltip,
} from "antd";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdDelete, MdMarkEmailRead } from "react-icons/md";
import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import TimeAgo from "javascript-time-ago";

try {
  TimeAgo.addDefaultLocale(en);
  TimeAgo.addLocale(ru);
} catch (error) {}
const Notification = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [unreadCount, setUnReadCount] = useState(0)

  const playNotificationSound = ()=>{
    const audio = new Audio('/notification.m4a')
    audio.play().catch((error)=>{
      console.log('failed to play audio',error)
    })
  }

  const handleNewNotification = ()=>{
    playNotificationSound()
    fetchNotifications()
  }

  useEffect(()=>{
    socket.on('newNotification',handleNewNotification)
    return ()=>{
      socket.off('newNotification',handleNewNotification)
    }
  },[])

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await GetNotificationsApi();
      if (response.data.success) {
        setNotifications(response.data.data.slice(0, 5)); // Show only latest 5
        setUnReadCount(response.data.data.filter((item)=>item.status === 'unread').length)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to fetch notifications:",
          error.response?.data?.message,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setActionLoading(id);
      const response = await MarkNotificationAsReadApi(id);
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id ? { ...n, status: "read" as const } : n,
          ),
        );
        messageApi.success("Marked as read");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error("Failed to mark as read");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setActionLoading(id);
      const response = await DeleteNotificationApi(id);
      if (response.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        messageApi.success("Notification deleted");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error("Failed to delete notification");
      }
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);


  const items: MenuProps["items"] = [
    {
      key: "header",
      label: (
        <div className="flex items-center justify-between p-2 border-b border-border-light dark:border-border-dark">
          <span className="font-medium text-primary-light dark:text-primary-dark">
            Notifications
          </span>
          <Link href="/admin/notifications">
            <Button type="link" size="small" className="text-bprimary">
              View All
            </Button>
          </Link>
        </div>
      ),
    },
    // Spread operator is required here to unpack the array returned by the ternary
    ...(loading
      ? [
          {
            key: "loading",
            label: (
              <div className="flex justify-center p-4">
                <Spin size="small" />
              </div>
            ),
            disabled: true,
          },
        ]
      : notifications.length === 0
        ? [
            {
              key: "empty",
              label: (
                <div className="p-4">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No notifications"
                    className="text-muted-light dark:text-muted-dark"
                  />
                </div>
              ),
              disabled: true,
            },
          ]
        : [
            {
              
              key: "notifications-list",
              className: "!cursor-default !bg-transparent !p-0", 
              label: (
                <div className="max-h-80 overflow-y-auto mb-4 flex flex-col gap-y-2">
                  {notifications.map((notification) => (
                   
                    <div
                      key={notification._id}
                      className={`p-3 max-w-80 border-b border-border-light dark:border-border-dark ${notification.status === "unread" ? "bg-bprimary-soft dark:bg-bprimary/10" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-primary-light dark:text-primary-dark line-clamp-1">
                              {notification.title}
                            </h4>
                            {notification.status === "unread" && (
                              <span className="w-2 h-2 bg-bprimary rounded-full shrink-0"></span>
                            )}
                          </div>
                          <p className="text-xs text-secondary-light dark:text-secondary-dark line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          <div className="text-xs text-muted-light dark:text-muted-dark">
                            <ReactTimeAgo
                              date={new Date(notification.createdAt)}
                              locale="en-US"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          {notification.status === "unread" && (
                            <Tooltip title='Mark as read'>

                              <Button
                                type="text"
                                size="small"
                                icon={<MdMarkEmailRead />}
                                loading={actionLoading === notification._id}
                                onClick={(e) =>
                                  handleMarkAsRead(notification._id, e)
                                }
                                className="text-success hover:bg-success/10 w-6 h-6 p-0"
                              />
                            </Tooltip>
                          )}
                          <Tooltip title='Delete'>

                          <Popconfirm
                            title="Delete?"
                            onConfirm={(e) =>
                              handleDelete(notification._id, e!)
                            }
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ size: "small" }}
                            cancelButtonProps={{ size: "small" }}
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<MdDelete />}
                              loading={actionLoading === notification._id}
                              className="text-error hover:bg-error/10 w-6 h-6 p-0"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Popconfirm>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]),
  ];

  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        placement="bottomRight"
        // overlayClassName="notification-dropdown"
      >
        <div className="relative cursor-pointer">
          <IoMdNotificationsOutline className="text-2xl md:text-3xl" />
          {unreadCount > 0 && (
            <div className="w-3 h-3 md:w-5 md:h-5 max-w-max max-h-max min-w-max min-h-max rounded-full bg-success absolute -top-1 -right-1 flex items-center justify-center text-center">
              {unreadCount > 9 ? (
                <span className="text-white text-xs font-bold pl-1">9+</span>
              ) : (
                <span className="text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
          )}
        </div>
      </Dropdown>
    </>
  );
};

export default Notification;
