import { GetDemoVideo } from "@/app/APIs/routes";
import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const VideoPlayer = ({ demoUrl }: { demoUrl: string }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [videoData, setVideoData] = useState<{otp:string,playbackInfo:string}>({otp:'',playbackInfo:''});
  console.log('video data',videoData)
  useEffect(() => {
    const getDemoVideo = async () => {
      try {
        const res = await GetDemoVideo({ videoUrl:demoUrl });
        if (res.data.success) {
          setVideoData(res.data.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          messageApi.error("Failed to fetch Demo Video");
        }
      }
    };
    getDemoVideo();
  }, []);
  return (
    <div className="w-full border dark:border-border-dark border-border-light h-full!">
      {contextHolder}
      <iframe
        src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
        className="w-full h-full"
        allow="encrypted-media"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
