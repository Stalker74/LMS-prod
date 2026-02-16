"use client";

import { GetLayoutDataApi } from "@/app/APIs/routes";
import { Collapse, CollapseProps, message, Skeleton } from "antd";
import React, { useEffect, useState } from "react";

const Faqs = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fallbackFaqs = [
    {
      question: "What courses do you offer?",
      answer: "We offer a wide range of courses including Web Development, Data Science, Mobile App Development, Digital Marketing, and many more. Our courses are designed by industry experts and updated regularly to match current market demands."
    },
    {
      question: "How long do I have access to a course?",
      answer: "Once you enroll in a course, you have lifetime access to all course materials, including future updates. You can learn at your own pace and revisit the content whenever you need."
    },
    {
      question: "Do you provide certificates?",
      answer: "Yes, we provide industry-recognized certificates upon successful completion of each course. These certificates can be shared on your LinkedIn profile and included in your resume."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with your course within 30 days of purchase, we'll provide a full refund, no questions asked."
    },
    {
      question: "Are there any prerequisites for the courses?",
      answer: "Prerequisites vary by course. Most beginner courses require no prior experience, while advanced courses may require some background knowledge. Check the course description for specific requirements."
    },
    {
      question: "Do you offer student support?",
      answer: "Absolutely! We provide 24/7 student support through our discussion forums, live chat, and email. Our instructors and teaching assistants are always ready to help you succeed."
    }
  ];

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await GetLayoutDataApi({ type: "faq" });
        if (res.data.success && res.data.data.faq?.length > 0) {
          setFaqs(res.data.data.faq);
        } else {
          setFaqs(fallbackFaqs);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        setError(true);
        setFaqs(fallbackFaqs);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const items: CollapseProps["items"] = faqs.map(
    (item: { question: string; answer: string }, i: number) => ({
      key: i,
      label: item?.question,
      children: item?.answer,
    })
  );

  if (loading) {
    return (
      <div className="">
        <div className="text-display text-center mb-10 lg:mb-16">
          FA<span className="text-accent">Qs</span>
        </div>
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="border border-border-light dark:border-border-dark rounded-lg p-4 flex flex-col gap-y-2">
              <Skeleton.Input active  style={{height:20}} className="h-full!"  />
              <Skeleton.Input block active  style={{height:70}} className="h-full!"  />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {contextHolder}
      <div className="text-display text-center mb-10 lg:mb-16">
        FA<span className="text-accent">Qs</span>
      </div>
      <Collapse
        accordion
        items={items}
        classNames={{ 
          title: "text-lg!", 
          body: "text-lg!", 
          root: '',
          header: 'dark:bg-card-dark bg-card-light'
        }}
      />
    </div>
  );
};

export default Faqs;
