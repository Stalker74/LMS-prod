import Lottie from "lottie-react";
import React from "react";
import lottieAnimation from '@/public/loader.json'

const InitialPageloader = () => {
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-body-light dark:bg-body-dark">
      <div className="text-center">
        <div className="h-80 lg:h-100 mx-auto aspect-square ">
          <Lottie
            animationData={lottieAnimation}
            loop={true}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default InitialPageloader;
