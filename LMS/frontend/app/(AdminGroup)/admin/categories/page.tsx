"use client";

import { CreateLayoutApi, UpdateLayoutApi } from "@/app/APIs/routes";
import { dispatchCategories, dispatchFaqs } from "@/app/Redux/Layout";
import { Button, Input, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const Categories = () => {
  const reduxStoredCategories = useSelector(
    (state: any) => state.LayoutReducer.categories
  );
  const [categoriesPayload, setcategoriesPayload] = useState<
    { title: string }[]
  >(reduxStoredCategories);
  console.log("category payload", categoriesPayload);
  const [loading, setloading] = useState(false);
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [messageApi, contextHolder] = message.useMessage();
  const [categoriesAlreadyCreated, setcategoriesAlreadyCreated] =
    useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const firstCategoryTest = reduxStoredCategories?.[0];
    if (firstCategoryTest.title) {
      setcategoriesAlreadyCreated(true);
    }
  }, [reduxStoredCategories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const data = categoriesPayload.map((item, i) => {
      return i === index ? { ...item, title: value } : item;
    });
    setcategoriesPayload(data);
  };
  const handleCreateCategories = async () => {
    const isFieldsRequired = categoriesPayload.some(
      (item, i) => item.title === ""
    );
    if (isFieldsRequired) {
      return messageApi.error("All fields are required");
    }

    try {
      setloading(true);
      let res;
      categoriesAlreadyCreated
        ? (res = await UpdateLayoutApi({
            type: "category",
            category: categoriesPayload,
          }))
        : (res = await CreateLayoutApi({
            type: "category",
            category: categoriesPayload,
          }));

      if (res.data.success) {
        const data = res.data.data.category;
        messageApi.success("Categories created successfully");
        dispatch(dispatchCategories(data));
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
        {categoriesPayload?.length > 0 &&
          categoriesPayload?.map((item, i) => {
            return (
              <div key={i}>
                <div>
                  <div className="flex justify-between items-center  flex-row-reverse gap-x-2">
                    <MdDeleteOutline
                      color="red"
                      className="cursor-pointer"
                      size={screenWidth < 768 ? 25 : 25}
                      onClick={() => {
                        setcategoriesPayload((pre) => {
                          const ref = [...pre];
                          return ref.filter((item, index) => index !== i);
                        });
                      }}
                    />
                  <Input
                    placeholder={`Category ${i + 1}`}
                    type={"text"}
                    onChange={(e) => handleInputChange(e, i)}
                    value={item.title}
                    name="question"
                    />
                    </div>
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
            setcategoriesPayload((pre) => [...pre, { title: "" }]);
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
          onClick={handleCreateCategories}
        >
          {categoriesAlreadyCreated ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default Categories;
