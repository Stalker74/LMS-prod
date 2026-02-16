//User Authentication

import axios from "axios";
import {
  IActivateAccountPayload,
  IActivateAccountResponse,
  IAnalyticsResponse,
  ICreateCheckoutSessionPayload,
  ICreateCheckoutSessionResponse,
  IDeleteCourseResponse,
  IDeleteUserResponse,
  IDemoVideoResponse,
  IEditCourseResponse,
  IForgetPasswordPayload,
  IForgetPasswordResponse,
  IGetAllCoursesResponse,
  IGetAllUsersResponse,
  IGetSingleCourseResponse,
  IGetUserProfileResponse,
  ILayoutPayload,
  ILayoutResponse,
  IloginUserPayload,
  IloginUserResponse,
  ILogoutUserResponse,
  IOrdersResponse,
  IPaymentVerificationPayload,
  IPaymentVerificationResponse,
  IRefreshAccessTokenResponse,
  IRegisterUserPayload,
  IRegisterUserResponseData,
  IResendCodePayload,
  IResendCodeResponse,
  IResetPasswordPayload,
  IResetPasswordResponse,
  ISocialOauthPayload,
  ISocialOauthResponse,
  IUpdateAvatarPayload,
  IUpdateAvatarResponse,
  IUpdatePasswordPayload,
  IUpdatePasswordResponse,
  IUpdateUserProfilePayload,
  IUpdateUserProfileResponse,
  IUpdateUserRolePayload,
  IUpdateUserRoleResponse,
  IUploadCoursePayload,
  IUploadCourseResponse,
} from "../types/apifn.types";
import { ICreateOrderPayload, ICreateOrderResponse, ICourseContentResponse, IAddQuestionPayload, IAddQuestionResponse, IAddAnswerPayload, IAddAnswerResponse, IAddReviewPayload, IAddReviewResponse, IAddReviewReplyPayload, IAddReviewReplyResponse, ICourseReviewsResponse, IEditReviewPayload, IEditReviewResponse, IGetUserReviewResponse, ISearchCoursesResponse, IGetNotificationsResponse, IUpdateNotificationResponse, IDeleteNotificationResponse, IGetAllReviewsResponse, IGetEnrolledCoursesResponse } from "../types/apifn.types";
import { axiosInstance } from "./config";
import { ICreateCoursePayload } from "../(AdminGroup)/admin/create-courses/page";

export const RegisterUser = async (payload: IRegisterUserPayload) => {
  return axiosInstance.post<IRegisterUserResponseData>(
    "/userAuth/register",
    payload
  );
};

export const ActivateAccount = async (
  payload: IActivateAccountPayload,
  verifyEmail: boolean
) => {
  const path = verifyEmail
    ? "/userAuth/activate-account?email=true"
    : "/userAuth/activate-account";
  return axiosInstance.post<IActivateAccountResponse>(path, payload);
};

export const ResendActivationCode = async (payload: IResendCodePayload) => {
  return axiosInstance.post<IResendCodeResponse>(
    "/userAuth/resend-code",
    payload
  );
};

export const LoginUser = async (payload: IloginUserPayload) => {
  return axiosInstance.post<IloginUserResponse>("/userAuth/login", payload);
};

export const ForgetPassword = async (payload: IForgetPasswordPayload) => {
  return axiosInstance.post<IForgetPasswordResponse>(
    "/userAuth/forget-password",
    payload
  );
};

export const ResetPasswordApi = async (payload: IResetPasswordPayload) => {
  return axiosInstance.post<IResetPasswordResponse>(
    "/userAuth/reset-password",
    payload
  );
};
export const LogoutUser = async () => {
  return axiosInstance.get<ILogoutUserResponse>("/userAuth/logout");
};

export const SocialOauth = async (payload: ISocialOauthPayload) => {
  return axiosInstance.post<ISocialOauthResponse>(
    "/userAuth/social-oauth",
    payload
  );
};
export const RefreshToken = async () => {
  return axiosInstance.get<IRefreshAccessTokenResponse>(
    "/userAuth/refresh-token"
  );
};
export const GetProfileData = async () => {
  return axiosInstance.get<IGetUserProfileResponse>("/userAuth/me");
};
export const UpdateProfile = async (payload: IUpdateUserProfilePayload) => {
  return axiosInstance.post<IUpdateUserProfileResponse>(
    "/userAuth/update-profile",
    payload
  );
};
export const UpdatePassword = async (payload: IUpdatePasswordPayload) => {
  return axiosInstance.patch<IUpdatePasswordResponse>(
    "/userAuth/update-password",
    payload
  );
};
export const UpdateAvatar = async (payload: IUpdateAvatarPayload) => {
  return axiosInstance.patch<IUpdateAvatarResponse>(
    "/userAuth/update-avatar",
    payload
  );
};
export const GetAllUsers = async () => {
  return axiosInstance.get<IGetAllUsersResponse>("/userAuth/get-all-users");
};
export const UpdateRole = async (
  payload: IUpdateUserRolePayload,
) => {
  return axiosInstance.patch<IUpdateUserRoleResponse>(
    `/userAuth/update-role`,
    payload
  );
};
export const DeleteUser = async (id: string) => {
  return axiosInstance.delete<IDeleteUserResponse>(
    `/userAuth/update-role/${id}`
  );
};

export const GetDemoVideo = async (videoUrl: { videoUrl: string }) => {
  return axiosInstance.post<IDemoVideoResponse>(
    "/courses/get-demoVideo",
    videoUrl
  );
};

export const CreateCourseApiFn = async (payload: IUploadCoursePayload) => {
  return axiosInstance.post<IUploadCourseResponse>("/courses/upload", payload);
};

export const GetAllCoursesApi = async () => {
  return axiosInstance.get<IGetAllCoursesResponse>("/courses/get-all-courses");
};
export const DeleteCourseApi = async (id:string) => {
  return axiosInstance.delete<IDeleteCourseResponse>(`/courses/delete-course/${id}`)
};
export const GetSingleCourseApi = async (id:string | null) => {
  return axiosInstance.get<IGetSingleCourseResponse>(`/courses/get-course/${id}`)
};
export const EditCourseApi = async (payload:ICreateCoursePayload,id:string | null) => {
  return axiosInstance.patch<IEditCourseResponse>(`/courses/edit/${id}`,payload)
};

export const CreateLayoutApi = async (payload:ILayoutPayload) => {
  return axiosInstance.post<ILayoutResponse>(`/layout/create`,payload)
};
export const GetLayoutDataApi = async (payload:{type:string}) => {
  return axiosInstance.post<ILayoutResponse>(`/layout/get-layout`,payload)
};
export const UpdateLayoutApi = async (payload:ILayoutPayload) => {
  return axiosInstance.patch<ILayoutResponse>(`/layout/update`,payload)
};


export const GetCourseAnalyticsApi = async()=>{
  return axiosInstance.get<IAnalyticsResponse>('/analytics/course')
}
export const GetUsersAnalyticsApi = async()=>{
  return axiosInstance.get<IAnalyticsResponse>('/analytics/user')
}
export const GetOrdersAnalyticsApi = async()=>{
  return axiosInstance.get<IAnalyticsResponse>('/analytics/order')
}


export const GetAllOrders = async()=>{
  return axiosInstance.get<IOrdersResponse>('/order/get-all-orders')
}


export const GetCoursesApi = async()=>{
  return axiosInstance.get<IGetAllCoursesResponse>('/courses/get-courses')
}

export const CreateCheckoutSessionApi = async(payload:ICreateCheckoutSessionPayload)=>{
  return axiosInstance.post<ICreateCheckoutSessionResponse>('/payment/create-checkout-session',payload)
}

export const SessionVerificationApi = async(payload:IPaymentVerificationPayload)=>{
  return axiosInstance.post<IPaymentVerificationResponse>('/payment/verification',payload)
}




export const CreateOrderApi = async(payload:ICreateOrderPayload)=>{
  return axiosInstance.post<ICreateOrderResponse>('/order/create',payload)
}

export const GetCourseContentApi = async(id:string)=>{
  return axiosInstance.get<ICourseContentResponse>(`/courses/get-course-content/${id}`)
}

// Q&A APIs
export const AddQuestionApi = async(payload: IAddQuestionPayload) => {
  return axiosInstance.patch<IAddQuestionResponse>('/courses/ask-question', payload)
}

export const AddAnswerApi = async(payload: IAddAnswerPayload) => {
  return axiosInstance.patch<IAddAnswerResponse>('/courses/answer-question', payload)
}

// Review APIs
export const AddReviewApi = async(payload: IAddReviewPayload, id:string) => {
  return axiosInstance.patch<IAddReviewResponse>(`/courses/add-review/${id}`, payload)
}

export const AddReviewReplyApi = async(payload: IAddReviewReplyPayload) => {
  return axiosInstance.patch<IAddReviewReplyResponse>('/courses/reply-review', payload)
}

export const GetCourseReviewsApi = async(courseId: string) => {
  return axiosInstance.get<ICourseReviewsResponse>(`/courses/get-reviews/${courseId}`)
}
export const EditReviewApi = async(payload: IEditReviewPayload, courseId: string) => {
  return axiosInstance.patch<IEditReviewResponse>(`/courses/edit-review/${courseId}`, payload)
}

export const GetUserReviewApi = async(courseId: string) => {
  return axiosInstance.get<IGetUserReviewResponse>(`/courses/get-user-review/${courseId}`)
}

// Advanced Courses Search API
export const SearchCoursesApi = async(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  return axiosInstance.get<ISearchCoursesResponse>(`/courses/search?${queryParams.toString()}`);
}

// Notification APIs
export const GetNotificationsApi = async() => {
  return axiosInstance.get<IGetNotificationsResponse>('/notification/get')
}

export const MarkNotificationAsReadApi = async(id: string) => {
  return axiosInstance.get<IUpdateNotificationResponse>(`/notification/update/${id}`)
}

export const DeleteNotificationApi = async(id: string) => {
  return axiosInstance.delete<IDeleteNotificationResponse>(`/notification/delete/${id}`)
}

// Get All Reviews API (for homepage)
export const GetAllReviewsApi = async() => {
  return axiosInstance.get<IGetAllReviewsResponse>('/courses/get-all-reviews')
}
// Get Enrolled Courses API
export const GetEnrolledCoursesApi = async() => {
  return axiosInstance.get<IGetEnrolledCoursesResponse>('/userAuth/enrolled-courses')
}
