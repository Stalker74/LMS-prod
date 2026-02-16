import { AsyncWrapper } from "../MiddleWare/AsyncWrapper.js";
import {
  CourseModel,
  ICourseDataSchema,
  ICourseSchema,
} from "../Model/course.model.js";
import cloudinary from "cloudinary";
import { customError } from "../Utils/customError.js";
import { redisClient } from "../Redis/init.redis.js";
import mongoose from "mongoose";
import { __dirname } from "./authuser.controller.js";
import path from "path";
import ejs from "ejs";
import { sendMail } from "../Utils/sendActivationEmail.js";
import { NotificationModel } from "../Model/notification.model.js";
import axios from "axios";

export const Upload_Course = AsyncWrapper(async (req, res, next) => {
  const courseData = req?.body;
  const thumbnail = req.body?.thumbnail;
    const Cloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });
    courseData.thumbnail = {
      public_id: Cloud.public_id,
      url: Cloud.secure_url,
  }
  const response = await CourseModel.create(courseData);
  return res.status(200).json({
    message: "Course Uploaded successfully",
    success: true,
    data: response,
  });
});

export const Edit_Course = AsyncWrapper(async (req, res, next) => {
  const id = req.params?.id;
  console.log("id is", id);
  let RequestedChanges = req.body;
  const thumbnail = req.body?.thumbnail;
  if (!thumbnail) {
    delete RequestedChanges.thumbnail;
  }
  console.log("hi");
  const isCourseAvailable = await CourseModel.findOne({ _id: id });
  console.log("course is", isCourseAvailable);
  if (!isCourseAvailable) {
    return next(customError(400, "Course does not exist"));
  }
  if (thumbnail && isCourseAvailable?.thumbnail.public_id) {
    cloudinary.v2.uploader.destroy(isCourseAvailable?.thumbnail.public_id);
    const cloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });
    RequestedChanges.thumbnail = {
      public_id: cloud.public_id,
      url: cloud.secure_url,
    };
  }
  if (thumbnail && !isCourseAvailable?.thumbnail.public_id) {
    const cloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: "courses",
    });
    RequestedChanges.thumbnail = {
      public_id: cloud.public_id,
      url: cloud.secure_url,
    };
  }

  const updatedCourse = await CourseModel.findByIdAndUpdate(
    id,
    RequestedChanges,
    { new: true }
  );
  return res.status(201).json({
    success: true,
    message: "Course updated successfully",
    data: updatedCourse,
  });
});

export const Get_Single_Course = AsyncWrapper(
  async (req, res, next) => {
    const id = req.params?.id;
    if (!id) {
      return next(customError(400, "Failed to fetch requested Course"));
    }
    // const isRedisAvailable = (await redisClient.get(id)) as any;
    // if (isRedisAvailable) {
    //   const parsedData = JSON.parse(isRedisAvailable);
    //   if (Object.keys(parsedData).length > 0) {
    //     console.log("redis hitting");
    //     return res.status(200).json({
    //       data: parsedData,
    //       success: true,
    //     });
    //   }
    // } 
    // else {
      console.log("db hitting");
    const Course = await CourseModel.findById(id).select(
      "-courseData.data.suggestion -courseData.data.questions "
    );
    // await redisClient.set(id, JSON.stringify(Course));
    return res.status(200).json({
      data: Course,
      success: true,
    });
  }
  // }
);

export const Get_Courses = AsyncWrapper(async (req, res, next) => 
  {
  // const isRedisAvailable = (await redisClient.get("allCourses")) as any;
  // const parsedData = JSON.parse(isRedisAvailable);
  // if (parsedData?.length > 0) {
  //   console.log("redis hitting");
  //   return res.status(200).json({
  //     data: parsedData,
  //     success: true,
  //   });
  // }
  //  else {
    console.log("db hitting");
  const Courses = await CourseModel.find().select(
    "-courseData.data.link -courseData.data.suggestion -courseData.data.questions -courseData.data.url"
  );
  await redisClient.set("allCourses", JSON.stringify(Courses));
  return res.status(200).json({
    data: Courses,
    success: true,
  });
  }
// }
)

export const Access_Course_Content = AsyncWrapper(async (req, res, next) => {
  const courseId = req.params?.id;
  const userEnrolledCourses: string[] = req.user?.courses;
  console.log("courses ", userEnrolledCourses);
  const isRequestedCourseEnrolled = userEnrolledCourses.find(
    (course: any) => course === courseId
  );

  if (!isRequestedCourseEnrolled) {
    return next(
      customError(400, "Access Denied ! User is not enrolled")
    );
  }
  const course = await CourseModel.findById(courseId);
  const courseContent = course?.courseData;
  return res.status(200).json({
    success: true,
    message: "Course Content fetched successfully",
    data: courseContent,
  });
});

export const Ask_Question = AsyncWrapper(async (req, res, next) => {
  const { courseId, contentId, question } = req.body;
  const user = req.user;
  // 1️⃣ Validate ObjectIds
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(contentId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid courseId or contentId",
    });
  }

  const Question = {
    question,
    user,
    answer: [],
    createdAt: new Date(),
  };

  // 2️⃣ Push question into specific courseData object
  const updatedCourse = await CourseModel.findOneAndUpdate(
    {
      _id: courseId,
      "courseData.data._id": contentId,
    },
    {
      $push: {
        "courseData.$.data.$[elem].questions": Question,
      },
    },
    { 
      new: true, 
      runValidators: true,
      arrayFilters: [{ "elem._id": contentId }]
    }
  );

  if (!updatedCourse) {
    return next(customError(400,'Failed to post question !'))
  }

  const courseSection = updatedCourse?.courseData.find((section: any) => 
    section.data.some((item: any) => item._id.toString() === contentId)
  );
  const courseContent = courseSection?.data.find((item: any) => 
    item._id.toString() === contentId
  );

  await NotificationModel.create({
    title: "New Question Asked",
    userId: user?._id,
    message: `${user?.name} just asked a new question about ${courseContent?.name}`,
  });
  res.status(200).json({
    success: true,
    message: "Question added successfully",
    data: updatedCourse,
  });
});

export const Answer_Question = AsyncWrapper(async (req, res, next) => {
  const { answer, courseId, contentId, questionId } = req.body;
  if (!courseId || !contentId || !questionId) {
    return next(customError(400, "Required Id is missing"));
  }
  const Course = await CourseModel.findOneAndUpdate(
    { _id: courseId, "courseData.data._id": contentId },
    {
      $push: {
        "courseData.$.data.$[elem].questions.$[q].answer": {
          answer,
          user: req.user,
          createdAt: new Date(),
        },
      },
    },
    {
      new: true,
      runValidators: true,
      arrayFilters: [
        { "elem._id": contentId },
        { "q._id": questionId }
      ],
    }
  );
  
  const TargetedQuestion = await CourseModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $unwind: "$courseData",
    },
    {
      $unwind: "$courseData.data",
    },
    {
      $unwind: "$courseData.data.questions",
    },
    {
      $match: {
        "courseData.data.questions._id": new mongoose.Types.ObjectId(questionId),
      },
    },
    {
      $match: {
        "courseData.data._id": new mongoose.Types.ObjectId(contentId),
      },
    },
    {
      $project: {
        data: "$courseData.data.questions",
        courseContent: "$courseData.data",
        _id: 0,
      },
    },
  ]);
  
  const targetQuestionData = TargetedQuestion[0]?.data;
  const emailTemplate = await ejs.renderFile(
    path.join(__dirname, "../Templates/NewAnswer.ejs"),
    {
      userName: targetQuestionData?.user?.name,
      questionText: targetQuestionData?.question,
      answerText: answer,
      questionUrl: "question url",
      replier: req.user?.name,
      courseContent: TargetedQuestion[0]?.courseContent?.name,
    }
  );
  await sendMail({
    to: targetQuestionData?.user?.email,
    subject: `${req.user?.name} answered to your question`,
    html: emailTemplate,
  });
  console.log("targeted question is", TargetedQuestion);
  if (!Course) {
    return next(customError(400, "Failed to post answer"));
  }
  return res.status(201).json({
    success: true,
    message: "Answer posted successfully",
    data: Course,
  });
});

export const Add_Review = AsyncWrapper(async (req, res, next) => {
  const courseId = req.params?.id;
  const comment = req.body?.comment;
  const rating = req.body?.rating;
  const user = req.user;
  const enrolledCourses = user?.courses;
  const isUserEligible = enrolledCourses.some(
    (course: string) => course === courseId
  );
  if (!isUserEligible) {
    return next(
      customError(400, "You are not eligible to add review to this course")
    );
  }

  // Check if user already has a review
  const existingCourse = await CourseModel.findById(courseId);
  const existingReview = existingCourse?.reviews?.find(
    (review: any) => review.user._id.toString() === user._id.toString()
  );
  
  if (existingReview) {
    return next(customError(400, "You have already reviewed this course. Use edit review instead."));
  }

  const reviewData = {
    comment, 
    rating,
    user,
    createdAt: new Date(),
  };

  const addReview = await CourseModel.findOneAndUpdate(
    {
      _id: courseId,
    },
    {
      $push: {
        reviews: reviewData,
      },
    },
    { new: true, runValidators: true }
  );

  
  if (!addReview) {
    return next(customError(400, "Failed to add review"));
  }

  await NotificationModel.create({
  title: "New Review Added",
  userId: user?._id,
  message: `${user?.name} give review to the course ${existingCourse?.name}`,
});
  const allReveiws = addReview?.reviews;
  console.log("all reviews are", allReveiws);
  let totalSum: number = 0;

  allReveiws?.forEach((rev: any) => {
    const rating = Number(rev?.rating);
    if (!isNaN(rating)) {
      totalSum += rating;
    }
  });

  console.log("total sum is", totalSum);

  const avgRating = totalSum / allReveiws?.length;
  console.log("avg Rating", avgRating);
  const Course = await CourseModel.findOneAndUpdate(
    {
      _id: courseId,
    },
    {
      ratings: avgRating,
    },
    { new: true, runValidators: true }
  );

  if (!addReview) {
    return next(customError(400, "Failed to add review"));
  }
  return res.status(200).json({
    success: true,
    message: "Review added successfully",
    data: Course,
  });
});

export const Reply_Review = AsyncWrapper(async (req, res, next) => {
  const { reply, courseId, reviewId } = req.body;
  if (!courseId || !reviewId) {
    return next(customError(400, "Failed to post your reply"));
  }
  const AdminReply = {
    reply,
    user: req.user,
    createdAt: new Date(),
  };
  const Course = await CourseModel.findOneAndUpdate(
    {
      _id: courseId,
      "reviews._id": reviewId,
    },
    {
      $push: {
        "reviews.$.reviewReplies": AdminReply,
      },
    },
    { new: true, runValidators: true }
  );
  if (!Course) {
    return next(customError(400, "Failed to post your reply!"));
  }
  return res.status(200).json({
    messsage: "Your reply has been posted successfully",
    success: true,
    data: Course,
  });
});

export const Get_All_Courses = AsyncWrapper(async (req, res, next) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    data: courses,
  });
});

export const Delete_Course = AsyncWrapper(async (req, res, next) => {
  const courseId = req.params?.id;
  console.log("course id is", courseId);
  const courseDeleted = await CourseModel.findByIdAndDelete(courseId);
  await redisClient.del(courseId);
  if (!courseDeleted) {
    return next(customError(400, "Failed to delete requested Course"));
  }
  const courses = await CourseModel.find({});
  return res.status(200).json({
    success: true,
    message: "Course Deleted successfully",
    data: courses,
  });
});

export const VdoCipher_Video_Data = AsyncWrapper(async (req, res, next) => {
  const { videoUrl } = req.body;
  const response = await axios.post(
    `https://dev.vdocipher.com/api/videos/${videoUrl}/otp`,
    { ttl: 300 },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRETS}`,
      },
    }
  );
  if (!response.data) {
    return next(customError(400, "Failed to fetch Requested Video"));
  }
  return res.status(200).json({ success: true, data: response.data });
});



export const Get_Reviews = AsyncWrapper(async(req,res,next)=>{
  const courseId = req.params?.id
  if(!courseId){
    return next(customError(400,'Failed to post your review'))
  }
  const reviews = await CourseModel.findById(courseId)
  if(!reviews){
    return next(customError(400,'Failed to find request course'))
  }
  return res.status(200).json({
    success:true,
    data:reviews?.reviews
  })

})

export const Get_All_Reviews = AsyncWrapper(async(req,res,next)=>{
  const courses = await CourseModel.find({}, 'reviews name').populate('reviews.user', 'name avatar');
  
  const allReviews = courses.reduce((acc: any[], course: any) => {
    if (course.reviews && course.reviews.length > 0) {
      const courseReviews = course.reviews.map((review: any) => ({
        ...review.toObject(),
        courseName: course.name,
        courseId: course._id
      }));
      acc.push(...courseReviews);
    }
    return acc;
  }, []);

  // Sort by creation date (newest first) and limit to latest 20
  const sortedReviews = allReviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return res.status(200).json({
    success: true,
    data: sortedReviews
  });
})

export const Edit_Review = AsyncWrapper(async (req, res, next) => {
  const courseId = req.params?.id;
  const comment = req.body?.comment;
  const rating = req.body?.rating;
  const user = req.user;
  
  if (!courseId || !comment || !rating) {
    return next(customError(400, "Course ID, comment, and rating are required"));
  }

  const enrolledCourses = user?.courses;
  const isUserEligible = enrolledCourses.some(
    (course: string) => course === courseId
  );
  
  if (!isUserEligible) {
    return next(
      customError(400, "You are not eligible to edit review for this course")
    );
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(customError(400, "Course not found"));
  }

  const reviewIndex = course.reviews.findIndex(
    (review: any) => review.user._id.toString() === user._id.toString()
  );

  if (reviewIndex === -1) {
    return next(customError(400, "You haven't reviewed this course yet"));
  }

  // Update the review
  course.reviews[reviewIndex].comment = comment;
  course.reviews[reviewIndex].rating = rating;
  course.reviews[reviewIndex].createdAt  = new Date() as any

  await course.save(); 

  await NotificationModel.create({
  title: "Review Edited",
  userId: user?._id,
  message: `${user?.name} has edited his review to the course ${course.name}`,
  })


  // Recalculate average rating
  let totalSum = 0;
  course.reviews.forEach((rev: any) => {
    const rating = Number(rev?.rating);
    if (!isNaN(rating)) {
      totalSum += rating;
    }
  });

  const avgRating = totalSum / course.reviews.length;
  course.ratings = avgRating;
  await course.save();

  return res.status(200).json({
    success: true,
    message: "Review updated successfully",
  });
});

export const Get_User_Review = AsyncWrapper(async (req, res, next) => {
  const courseId = req.params?.id;
  const user = req.user;
  
  if (!courseId) {
    return next(customError(400, "Course ID is required"));
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(customError(400, "Course not found"));
  }

  const userReview = course.reviews.find(
    (review: any) => review.user._id.toString() === user._id.toString()
  );

  return res.status(200).json({
    success: true,
    data: userReview || null,
  });
});

export const Search_Courses = AsyncWrapper(async (req, res, next) => {
  const {
    page = 1,
    limit = 12,
    search = "",
    category = "",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build search query
  let searchQuery: any = {};

  // Text search across multiple fields
  if (search) {
    searchQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search as string, "i")] } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  // Category filter
  if (category) {
    searchQuery.category = { $regex: category, $options: "i" };
  }

  // Build sort object
  const sortObj: any = {};
  sortObj[sortBy as string] = sortOrder === "asc" ? 1 : -1;

  try {
    // Get total count for pagination
    const totalCourses = await CourseModel.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCourses / limitNum);

    // Get courses with pagination and sorting
    const courses = await CourseModel.find(searchQuery)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select("-courseData"); // Exclude course content for performance

    return res.status(200).json({
      success: true,
      data: {
        courses,
        totalCourses,
        totalPages,
        currentPage: pageNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    return next(customError(500, "Failed to search courses"));
  }
});