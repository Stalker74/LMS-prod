import { Rate } from "antd";
import Image from "next/image";
import React from "react";

interface ReviewCardProps {
  review?: {
    user: {
      name?: string;
      avatar?: {
        url?: string;
      };
    };
    comment: string;
    rating: number;
    createdAt?: Date;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    console.log('review is',review)
  const defaultData = {
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww",
    name: "Gene Batesjkllrkle",
    comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus cum natus est explicabo vel perferendis perspiciatis blanditiis recusandae, minus maiores nostrum at officiis.",
    rating: 4,
  };

  const data = review ? {
    image: review.user?.avatar?.url || defaultData.image,
    name: review.user?.name || defaultData.name,
    comment: review.comment || defaultData.comment,
    rating: review.rating || defaultData.rating,
  } : defaultData;

  const date = review?.createdAt ? new Date(review.createdAt) : new Date();

  return (
    <div>
      <div
        className="dark:bg-card-dark bg-card-light w-full border border-border-light dark:border-border-dark px-4 md:px-6 py-4 md:py-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-y-3 rounded-md md:rouned-lg"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            <div className=" relative w-12 h-12 md:w-16 md:h-16 shrink-0">
              <Image
                src={data.image}
                alt="image"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="font-bold leading-tight max-w-18 whitespace-nowrap! text-ellipsis! overflow-hidden! md:max-w-50">
              {data.name}
            </div>
          </div>
          <div>
            <Rate value={data.rating} disabled size="small" className="" />
            <div className="text-muted-light dark:text-muted-dark text-xs md:text-sm">
              {date.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-sm md:text-base">{data.comment}</div>
      </div>
    </div>
  );
};

export default ReviewCard;
