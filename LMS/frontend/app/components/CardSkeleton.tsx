import { Rate, Skeleton } from "antd";
import React from "react";

const CardSkeleton = () => {
  return (
    <div
    
      className="rounded-lg border border-border-light dark:border-border-dark w-full"
    >
      <Skeleton.Image
        className="w-full! h-50"
        active
        style={{ width: "100%", height: "100%" }}
      />
      <div className="p-6">
        <div className="flex justify-center mb-3">
          <Rate value={0} size="small" />
        </div>
        <div className="w-full flex justify-center">
          <Skeleton.Input
            className="w-3/4 "
            style={{ height: "25px" }}
            active
          />
        </div>
        <div className="flex justify-center items-center mt-4">
          <Skeleton.Input
            style={{ width: "100%", height: 70 }}
            className="w-full!"
            active
          />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
