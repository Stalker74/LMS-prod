import axios from "axios";
import { LogoutUser, RefreshToken } from "./routes";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  // timeout:6,
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (axios.isAxiosError(error)) {
      if (error.status === 401) {
        try {
          console.log("triggered 1");
          const requestedApi = error.config as any;
          if (!requestedApi._retry) {
            requestedApi._retry = true;
            await axiosInstance.get("/userAuth/refresh-token");
            console.log("triggered 2");
            return axiosInstance(requestedApi as any);
          }
        } catch (error) {
          console.log(
            "error while refreshting token and recalling the api",
            error
          );
        }
      }
      if (error.status === 403) {
        // window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }
    }
    return Promise.reject(error);
  }
);
