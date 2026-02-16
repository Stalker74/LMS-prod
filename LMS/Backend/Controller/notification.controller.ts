import { AsyncWrapper } from "../MiddleWare/AsyncWrapper.js";
import { NotificationModel } from "../Model/notification.model.js";
import { customError } from "../Utils/customError.js";
import cron from "node-cron";

export const Get_Notifications = AsyncWrapper(async (req, res, next) => {
  const user = req.user;
  const notifications = await NotificationModel.find({
    // userId: user?._id,
  }).sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    data: notifications,
  });
});

export const Update_Notification = AsyncWrapper(async (req, res, next) => {
  const user = req?.user;
  const notificationId = req.params?.id;
  const updatedNotification = await NotificationModel.findByIdAndUpdate(
    notificationId,
    { status: "read" },
    { new: true, runValidators: true }
  );
  if (!updatedNotification?._id) {
    return next(customError(400, "Failed to updated Notification Status"));
  }
  const notifications = await NotificationModel.find({
    userId: user?._id,
  }).sort({ createdAt: -1 });
  return res.status(201).json({
    success: true,
    data: notifications,
  });
});

cron.schedule("0 0 * * *", async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    console.log('thirty days ago',thirtyDaysAgo)
    await NotificationModel.deleteMany({
      status: "read",
      createdAt: { $lt: thirtyDaysAgo }, 
    });
    console.log("hi");
  } catch (error) {
    console.log('error : ',error)
  }
});




export const Delete_Notification = AsyncWrapper(async (req, res, next) => {
  const user = req?.user;
  const notificationId = req.params?.id;
  
  const deletedNotification = await NotificationModel.findByIdAndDelete(notificationId);
  if (!deletedNotification) {
    return next(customError(400, "Failed to delete notification"));
  }
  
  const notifications = await NotificationModel.find({
    // userId: user?._id,
  }).sort({ createdAt: -1 });
  
  return res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
    data: notifications,
  });
});
