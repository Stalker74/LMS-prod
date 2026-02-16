"use client";

import { CreateLayoutApi, UpdateLayoutApi } from "@/app/APIs/routes";
import { dispatchFaqs } from "@/app/Redux/Layout";
import { Button, Input, message } from "antd";
import axios from "axios";
import { div } from "motion/react-client";
import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const FAQ = () => {
  const reduxStoredFaqs = useSelector((state: any) => state.LayoutReducer.faqs);
  const [faqPayload, setFaqPayload] =
    useState<{ question: string; answer: string }[]>(reduxStoredFaqs);
  console.log("faq payload", faqPayload);
  const [loading, setloading] = useState(false);
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [messageApi, contextHolder] = message.useMessage();
  const [faqsAlreadyCreated, setFaqsAlreadyCreated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const firstFaqTest = reduxStoredFaqs?.[0];
    if (firstFaqTest.question && firstFaqTest.answer) {
      setFaqsAlreadyCreated(true);
    }
  }, [reduxStoredFaqs]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const data = faqPayload.map((item, i) => {
      return i === index ? { ...item, [name]: value } : item;
    });
    setFaqPayload(data);
  };
  const handleCreateFaq = async () => {
    const isFieldsRequired = faqPayload.some((item,i)=>item.answer === '' && item.question === '')
    if(isFieldsRequired){
        return messageApi.error('All fields are required')
    }
    

    try {
      setloading(true);
      let res;
      faqsAlreadyCreated
        ? (res = await UpdateLayoutApi({
            type: "faq",
            faq: faqPayload,
          }))
        : (res = await CreateLayoutApi({
            type: "faq",
            faq: faqPayload,
          }));

      if (res.data.success) {
        const data = res.data.data.faq;
        messageApi.success("FAQs created successfully");
        dispatch(dispatchFaqs(data));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return messageApi.error(
          error.response?.data?.message ||
            "Something went wrong, Please try again later"
        );
      }
    } finally {
      setloading(false);
    }
  };
  return (
    <div>
      {contextHolder}
      <div className="flex flex-col gap-y-5 mb-4">
        {faqPayload?.length > 0 &&
          faqPayload?.map((item, i) => {
            return (
              <div key={i}>
                <div>
                  <div className="flex justify-between items-center">
                    <div className="mb-1 md:mb-2">Question {i + 1}</div>
                    <MdDeleteOutline
                      color="red"
                      className="cursor-pointer"
                      size={20}
                      onClick={()=>{
                        setFaqPayload(pre=>{
                            const ref = [...pre]
                            return ref.filter((item,index)=>index !== i)
                        })
                      }}
                    />
                  </div>
                  <Input
                    placeholder={`Question ${i + 1}`}
                    type={"text"}
                    onChange={(e) => handleInputChange(e, i)}
                    value={item.question}
                    name="question"
                  />
                </div>
                <div>
                  <div className="mb-1 md:mb-2">Answer {i + 1}</div>
                  <Input
                    placeholder={`Answer ${i + 1}`}
                    type={"text"}
                    onChange={(e) => handleInputChange(e, i)}
                    value={item.answer}
                    name="answer"
                  />
                </div>
              </div>
            );
          })}
      </div>
      <div className="flex justify-center">
        <IoMdAddCircleOutline
          size={screenWidth < 768 ? 25 : 30}
          color="green"
          className="cursor-pointer"
          onClick={() => {
            setFaqPayload((pre) => [...pre, { question: "", answer: "" }]);
          }}
        />
      </div>
      <div>
        <Button
          type="primary"
          variant="solid"
          block
          icon
          iconPlacement="end"
          loading={loading}
          className="mt-6"
          onClick={handleCreateFaq}
        >
          {faqsAlreadyCreated ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default FAQ;
