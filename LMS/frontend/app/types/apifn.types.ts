import { ICreateCoursePayload } from "../(AdminGroup)/admin/create-courses/page";

//Gerneric API Response
export type IGenericApiResponse<
  TData = void,
  TMessage extends boolean = true
> = {
  success: true;
} & (TMessage extends true ? { message: string } : {}) &
  (TData extends void ? {} : { data: TData });

//Global Data

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: string[];
  createdAt: Date;
}

export interface ICourseDataSchema {
  sectionName: string;
  data: {
    name: string;
    description: string;
    link: [
      {
        title: string;
        url: string;
      }
    ];
    url: string;
    suggestion: string[];
    questions: [
      {
        user: object;
        question: string;
        answer: object[];
        createdAt: Date;
      }
    ];
    videoLength: number;
  }[];
}

export interface ICourseData {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string[];
  level: string;
  category: string;
  demoUrl: string;
  benefits: string[];
  preRequisits: string[];
  purchased: number;
  reviews: [
    {
      user: object;
      comment: string;
      rating: number;
      createdAt?: Date;
      reviewReplies: object[];
    }
  ];
  courseData: ICourseDataSchema[];
  ratings: number;
  createdAt: Date;
}

// User Auth API Functions Static Typing

//User Register
export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface IRegisterUserResponseData
  extends IGenericApiResponse<void, true> {
  authToken: string;
  refreshToken: string;
}

//User Account Activation

export interface IActivateAccountPayload {
  verificationCode: string;
  authToken: string;
}
export interface IActivateAccountResponse
  extends IGenericApiResponse<void, true> {}

// Resend Activation Code

export interface IResendCodePayload {
  refreshToken: string;
}

export interface IResendCodeResponse extends IGenericApiResponse {
  authToken: string;
}

//Login User

export interface IloginUserPayload {
  email: string;
  password: string;
}
export interface IloginUserResponse extends IGenericApiResponse<IUser> {
  accessToken: string;
}

//Socila Oauth

export interface ISocialOauthPayload {
  name: string;
  email: string;
  image: string;
}

export interface ISocialOauthResponse
  extends IGenericApiResponse<IUser, false> {
  accessToken: string;
}

//Forget Password

export interface IForgetPasswordPayload {
  email: string;
}

export interface IForgetPasswordResponse extends IRegisterUserResponseData {}

//Reset Password

export interface IResetPasswordPayload {
  password: string;
  refreshToken: string;
}

export interface IResetPasswordResponse extends IGenericApiResponse {}
// LogOut User

export type ILogoutUserResponse = IGenericApiResponse;

//Refresh Access Token

export type IRefreshAccessTokenResponse = IloginUserResponse;

// Get User Profile

export interface IGetUserProfileResponse extends IGenericApiResponse<IUser> {}

// Update User Profile

export interface IUpdateUserProfilePayload {
  name?: string;
  email?: string;
}
export interface IUpdateUserProfileResponse
  extends IGenericApiResponse<IUser> {}

// Update Password

export interface IUpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdatePasswordResponse extends IGenericApiResponse {}

// UPdate Avatar

export interface IUpdateAvatarPayload {
  avatar: string | ArrayBuffer | null;
}

export interface IUpdateAvatarResponse extends IGenericApiResponse<IUser> {}

// Get all users

export interface IGetAllUsersResponse
  extends IGenericApiResponse<IUser[], false> {}

// Update User Role

export interface IUpdateUserRolePayload {
  role: string;
  email: string;
}
export interface IUpdateUserRoleResponse
  extends IGenericApiResponse<IUser[], true> {}

//Delete User

export interface IDeleteUserResponse extends IGenericApiResponse<IUser[]> {}

//Demo VIDEO Response

export interface IDemoVideoResponse
  extends IGenericApiResponse<{ otp: string; playbackInfo: string }, false> {}

//Create Course
export interface IUploadCoursePayload extends ICreateCoursePayload {}

export interface IUploadCourseResponse
  extends IGenericApiResponse<ICourseData> {}

//Edit Course

export interface IEditCoursePayload extends Partial<ICreateCoursePayload> {}

//GET aLL Courses

export interface IGetAllCoursesResponse
  extends IGenericApiResponse<ICourseData[], false> {}

//Delete Course

export interface IDeleteCourseResponse
  extends IGenericApiResponse<ICourseData[]> {}

//Get Single Course

export interface IGetSingleCourseResponse
  extends IGenericApiResponse<ICourseData> {}

// Edit course Response

export interface IEditCourseResponse extends IGenericApiResponse<ICourseData> {}

//Layout

export interface ILayoutResponse
  extends IGenericApiResponse<{
    type: string;
    banner: {
      title: string;
      subtitle: string;
      image: { public_id: string; url: string };
    };
    faq: [{ question: string; answer: string }];
    category: [{ title: string }];
  }> {}

export interface ILayoutPayload {
  type: string;
  faq?: { question: string; answer: string }[];
  category?: { title: string }[];
  banner?: { image: string; title: string; subtitle: string };
}

//Analytics

export interface IAnalyticsResponse
  extends IGenericApiResponse<{ count: number; month: string }[], false> {}

//Get Orders Data

export interface IOrdersResponse
  extends IGenericApiResponse<
    {
      _id: string;
      createdAt: Date;
      courseId: {
        price: string;
        name: string;
      };
      userId: {
        name: string;
        email: string;
      };
    }[]
  > {}

// Create Checkout Session

export interface ICreateCheckoutSessionPayload {
  courseId: string;
  userEmail: string;
  userId: string;
}

export interface ICreateCheckoutSessionResponse extends IGenericApiResponse<string,false>{}


//Verify Payment

export interface IPaymentVerificationPayload {
  id:string
}

export interface IPaymentVerificationResponse extends IGenericApiResponse{
  data: {
    userId: string;
    courseId: string;
  }
}

//Create Order
export interface ICreateOrderPayload {
  courseId: string;
  payment_info: object;
}

export interface ICreateOrderResponse extends IGenericApiResponse<IUser> {}

//Course Content Access
export interface ICourseContentResponse extends IGenericApiResponse<
  {
    sectionName: string;
    data: {
      _id: string;
      name: string;
      description: string;
      url: string;
      videoLength: string;
      link: { title: string; url: string }[];
      questions: {
        _id: string;
        user: {
          _id: string;
          name: string;
          avatar: { url: string };
          role:string
        };
        question: string;
        answer: {
          _id: string;
          user: {
            _id: string;
            name: string;
            avatar: { url: string };
            role:string
          };
          answer: string;
          createdAt: Date;
        }[];
        createdAt: Date;
      }[];
    }[];
  }[],
  false
> {}

// Add Question
export interface IAddQuestionPayload {
  question: string;
  courseId: string;
  contentId: string;
}

export interface IAddQuestionResponse extends IGenericApiResponse {}

// Add Answer
export interface IAddAnswerPayload {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export interface IAddAnswerResponse extends IGenericApiResponse {}

// Add Review
export interface IAddReviewPayload {
  rating: number;
  comment: string;
  
}

export interface IAddReviewResponse extends IGenericApiResponse {}

// Add Review Reply (Admin only)
export interface IAddReviewReplyPayload {
  reply: string;
  courseId: string;
  reviewId: string;
}

export interface IAddReviewReplyResponse extends IGenericApiResponse {}

// Get Course Reviews
export interface ICourseReviewsResponse extends IGenericApiResponse<
  {
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar: { url: string };
      role:string
    };
    comment: string;
    rating: number;
    createdAt: Date;
    reviewReplies: {
      _id: string;
      user: {
        _id: string;
        name: string;
        avatar: { url: string };
        role:string
      };
      reply: string;
      createdAt: Date;
    }[];
  }[],
  false
> {}
// Edit Review
export interface IEditReviewPayload {
  rating: number;
  comment: string;
}

export interface IEditReviewResponse extends IGenericApiResponse {}

// Get User's Review for Course
export type IGetUserReviewResponse = IGenericApiResponse<
  {
    _id: string;
    comment: string;
    rating: number;
    createdAt: Date;
  } | null,
  false
>;

// Search Courses Response
export interface ISearchCoursesResponse extends IGenericApiResponse<
  {
    courses: ICourseData[];
    totalCourses: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  },
  false
> {}

// Notification Types
export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: Date;
  updatedAt: Date;
}

// Get Notifications Response
export interface IGetNotificationsResponse extends IGenericApiResponse<INotification[], false> {}

// Update Notification Response
export interface IUpdateNotificationResponse extends IGenericApiResponse<INotification[]> {}

// Delete Notification Response
export interface IDeleteNotificationResponse extends IGenericApiResponse<INotification[]> {}

// Get All Reviews Response (for homepage)
export interface IGetAllReviewsResponse extends IGenericApiResponse<
  {
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar: { url: string };
      role: string;
    };
    comment: string;
    rating: number;
    createdAt: Date;
    courseName: string;
    courseId: string;
  }[],
  false
> {}
// Get Enrolled Courses Response
export interface IGetEnrolledCoursesResponse extends IGenericApiResponse<ICourseData[], false> {}
