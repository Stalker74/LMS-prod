"use client";

import {
  Button,
  Collapse,
  Form,
  FormProps,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Select,
  Space,
  Steps,
  Tag,
  UploadProps,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa6";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import {
  MdAddBox,
  MdDeleteOutline,
  MdOutlineAddLink,
  MdUpload,
  MdEdit,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { div, input } from "motion/react-client";
import { IoAddCircleOutline } from "react-icons/io5";
import { current } from "@reduxjs/toolkit";
import { AiOutlineDelete } from "react-icons/ai";
import { FiDelete } from "react-icons/fi";
import { IoIosAddCircleOutline, IoMdRemove } from "react-icons/io";
import { TiDeleteOutline } from "react-icons/ti";
import VideoPlayer from "@/app/components/AdminComponents/VideoPlayer";
import { LiaCheckDoubleSolid } from "react-icons/lia";
import {
  CreateCourseApiFn,
  EditCourseApi,
  GetLayoutDataApi,
  GetSingleCourseApi,
} from "@/app/APIs/routes";
import axios, { Axios } from "axios";
import { useSearchParams } from "next/navigation";

type FieldType = {
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  tags: string[];
  level: string;
  demoUrl: string;
  thumbnail: string;
  category: string;
};

export type ICreateCoursePayload = {
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  thumbnail: string;
  tags: string[];
  level: string;
  demoUrl: string;
  benefits: string[];
  preRequisits: string[];
  courseData: {
    sectionName: string;
    data: {
      name: string;
      description: string;
      link: { title: string; url: string }[];
      url: string;
      videoLength: number;
    }[];
  }[];
};

const CreateCourse = () => {
  const [loading, setloading] = useState(false);
  const [form] = useForm();
  const [initialCourseInformation, setInitialCourseInformation] =
    useState<FieldType>({
      name: "",
      description: "",
      price: 0,
      estimatedPrice: 0,
      tags: [],
      level: "",
      demoUrl: "",
      thumbnail: "",
      category: "",
    });
  const [base64ThumbnailUrl, setBase64ThumbnailUrl] = useState("");
  console.log("initial form data", initialCourseInformation);
  const [Tags, setTags] = useState<any>([]);
  const [ThumbnailUrl, setThumbnailUrl] = useState("");
  console.log("thumbanil url", ThumbnailUrl);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const data = { ...values, tags: Tags, thumbnail: base64ThumbnailUrl };
    console.log("values are", values);
    setInitialCourseInformation(data);
    setCurrentStep(1);
  };
  console.log("tags are", Tags);
  const [InputValue, setInputValue] = useState("");
  const { screenWidth } = useSelector((state: any) => state.UtilReducer);
  const [CurrentStep, setCurrentStep] = useState(0);
  console.log("current setep is", CurrentStep);
  const [courseBenifits, setCourseBenefits] = useState([""]);
  const [coursePrereq, setCoursePrereq] = useState([""]);
  console.log("course benifts are", courseBenifits);
  console.log("course prereq are", coursePrereq);
  const [messageApi, contextHolder] = message.useMessage();
  const [sectionDeleteDialog, setSectionDeleteDialog] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(
    null
  );
  const [indexOfSectionToDelete, setIndexOfSectionToDelete] = useState(0);
  console.log("targeted delete index", indexOfSectionToDelete);
  const [CourseData, setCourseData] = useState([
    {
      sectionName: "",
      data: [
        {
          name: "UnNamed",
          description: "",
          link: [{ title: "", url: "" }],
          url: "",
          videoLength: 0,
        },
      ],
    },
  ]);
  const searchParams = useSearchParams();
  const courseToBeEdited = searchParams.get("edit");
  console.log("coursee to be eiditied", courseToBeEdited);
  const [createCoursePayload, setCreateCoursePayload] =
    useState<ICreateCoursePayload>({
      name: "",
      description: "",
      price: 0,
      estimatedPrice: 0,
      thumbnail: "",
      tags: [""],
      level: "",
      demoUrl: "",
      benefits: [""],
      preRequisits: [""],
      courseData: [
        {
          sectionName: "",
          data: [
            {
              name: "",
              description: "",
              url: "",
              link: [{ title: "", url: "" }],
              videoLength: 0,
            },
          ],
        },
      ],
    });

  const [categoriesData, setCategoiresData] = useState<{ title: string }[]>();
  console.log("create course paylaod", createCoursePayload);

  console.log("courseData is", CourseData);

  useEffect(() => {
    const requestedCourse = async () => {
      try {
        const res = await GetSingleCourseApi(courseToBeEdited);
        if (res.data.success) {
          const data = res.data.data;
          // setCreateCoursePayload(data);
          setThumbnailUrl(data.thumbnail.url);
          const reader = new FileReader();
          reader.onloadend = () => {
            var base64Image = reader.result;
          };

          const courseInformation = {
            name: data.name,
            description: data.description,
            price: data.price,
            estimatedPrice: data.estimatedPrice,
            tags: data.tags,
            level: data.level,
            demoUrl: data.demoUrl,
            thumbnail: data.thumbnail.url,
            category: data.category,
          };
          setInitialCourseInformation(courseInformation);
          form.setFieldsValue(courseInformation);
          setTags(courseInformation.tags);
          setCourseBenefits(data.benefits);
          setCoursePrereq(data.preRequisits);
          setCourseData(data.courseData || []);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return messageApi.error(
            error.response?.data.message ||
              "Something went wrong, Fialed to fetch course Data"
          );
        }
      }
    };
    const resetFormsFields = () => {
      setInitialCourseInformation({
        name: "",
        description: "",
        price: 0,
        estimatedPrice: 0,
        tags: [],
        level: "",
        demoUrl: "",
        thumbnail: "",
        category: "",
      });
      form.setFieldsValue({
        name: "",
        description: "",
        price: 0,
        estimatedPrice: 0,
        tags: [],
        level: "",
        demoUrl: "",
        thumbnail: "",
      });
      setCourseData([
        {
          sectionName: "",
          data: [
            {
              name: "UnNamed",
              description: "",
              link: [{ title: "", url: "" }],
              url: "",
              videoLength: 0,
            },
          ],
        },
      ]);
      setCreateCoursePayload({
        name: "",
        description: "",
        price: 0,
        estimatedPrice: 0,
        thumbnail: "",
        tags: [""],
        level: "",
        demoUrl: "",
        benefits: [""],
        preRequisits: [""],
        courseData: [
          {
            sectionName: "",
            data: [
              {
                name: "",
                description: "",
                url: "",
                link: [{ title: "", url: "" }],
                videoLength: 0,
              },
            ],
          },
        ],
      });
      setTags([]);
      setBase64ThumbnailUrl("");
      setCourseBenefits([]);
      setCoursePrereq([]);
      setThumbnailUrl("");
    };
    courseToBeEdited ? requestedCourse() : resetFormsFields();
  }, [courseToBeEdited]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GetLayoutDataApi({ type: "category" });
        if (res.data.success) {
          setCategoiresData(res.data.data.category);
        }
      } catch (error) {
        messageApi.error("Failed to fetch Categoires, Please refresh the page");
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Check if the user hit space (to add tag)
    if (value.endsWith(" ")) {
      const newTag = value.trim();

      // Only add if not empty and doesn't exist yet
      if (newTag && !Tags.includes(newTag)) {
        const newTagsList = [...Tags, newTag];
        setTags(newTagsList);
        setInputValue("");
      }
    } else {
      // Normal typing
      setInputValue(value);
    }
  };

  // 2. Handle removing a tag
  const handleTagRemove = (tagToRemove: string) => {
    const newTagsList = Tags.filter((tag: any) => tag !== tagToRemove);
    setTags(newTagsList);
  };

  const tagColor = () => {
    const presets = [
      "magenta",
      "red",
      "volcano",
      "orange",
      "gold",
      "lime",
      "green",
      "cyan",
      "blue",
      "geekblue",
      "purple",
    ];
    const randomNumber = Math.floor(Math.random() * 10);
    return presets[randomNumber];
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageObject = e.target.files?.[0];
    const ImageUrl = URL.createObjectURL(imageObject as any);
    setThumbnailUrl(ImageUrl);
    if (imageObject) {
      const reader = new FileReader();
      reader.readAsDataURL(imageObject);
      reader.onloadend = async () => {
        const base64ImageUrl = reader.result;
        console.log("base 64 image url", base64ImageUrl);
        setBase64ThumbnailUrl(base64ImageUrl as any);
      };
    }
  };

  const handleStepChange = (value: number) => {
    setCurrentStep(value);
  };

  const handlePreReq = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const benefit = e.target.value;
    setCoursePrereq((pre) => {
      const referenceArray = [...pre];
      referenceArray[i] = benefit;
      return referenceArray;
    });
  };
  const handleBenefits = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const benefit = e.target.value;
    setCourseBenefits((pre) => {
      const referenceArray = [...pre];
      referenceArray[i] = benefit;
      return referenceArray;
    });
  };

  const handleNextCourseOption = () => {
    const filteredBenifits = courseBenifits?.filter((item, i) => item !== "");
    const filteredPreReq = coursePrereq.filter((item, i) => item !== "");
    if (
      courseBenifits.length > 0 &&
      coursePrereq?.length > 0 &&
      courseBenifits[0] !== "" &&
      coursePrereq[0] !== ""
    ) {
      setCurrentStep((pre) => pre + 1);
      setCourseBenefits(filteredBenifits);
      setCoursePrereq(filteredPreReq);
    } else {
      messageApi.warning("Course Options are required !");
      return;
    }
  };

  const handleAddNewSection = () => {
    setCourseData((pre) => [
      ...pre,
      {
        sectionName: "",
        data: [
          {
            name: "UnNamed",
            description: "",
            link: [{ title: "", url: "" }],
            url: "",
            videoLength: 0,
          },
        ],
      },
    ]);
  };

  const handleSectionNameUpdate = (sectionIndex: number, newName: string) => {
    const updatedData = CourseData.map((section, index) => {
      if (index === sectionIndex) {
        return { ...section, sectionName: newName };
      }
      return section;
    });
    setCourseData(updatedData);
  };
  const handleDeleteSection = () => {
    setSectionDeleteDialog(false);
    if (!indexOfSectionToDelete) return;
    const targetedIndex = indexOfSectionToDelete - 1;
    const filteredCourseData = CourseData.filter(
      (item, i) => targetedIndex !== i
    );
    setCourseData(filteredCourseData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
    mainIndex: number,
    contentIndex?: number,
    linkIndex?: number,
    linkField?: string
  ) => {
    const value = e.target.value;
    const newData = CourseData.map((item, i) => {
      if (i === mainIndex) {
        return {
          ...item,
          data: item.data.map((j, k) => {
            if (k === contentIndex) {
              if (type === "name") {
                return {
                  ...j,
                  name: value,
                };
              }

              if (type === "description") {
                return {
                  ...j,
                  description: value,
                };
              }

              if (type === "url") {
                return {
                  ...j,
                  url: value,
                };
              }
              if (type === "videoLength") {
                return {
                  ...j,
                  videoLength: Number(value),
                };
              }

              if (type === "link") {
                return {
                  ...j,
                  link: j.link.map((l, m) => {
                    if (m === linkIndex) {
                      console.log("lin title triggering");
                      if (linkField === "title") {
                        return {
                          ...l,
                          title: value,
                        };
                      }
                      if (linkField === "url") {
                        console.log("link url triggering");
                        return {
                          ...l,
                          url: value,
                        };
                      }
                    }
                    return l;
                  }),
                };
              }
            }

            return j;
          }),
        };
      }
      return item;
    });
    setCourseData(newData);
  };

  const handleNextCourseContent = () => {
    if (CourseData.length === 0) {
      return messageApi.warning("Minimum One section is required");
    }
    for (const course of CourseData) {
      if (!course.sectionName || course.sectionName.trim() === "") {
        return messageApi.warning("Section name is required");
      }
      const currentCourse = course.data;
      if (currentCourse.length === 0) {
        return messageApi.warning("Minimum One Content Section is required");
      }
      for (const content of currentCourse) {
        if (!content.name) {
          return messageApi.warning("Course Title is requried");
        }
        if (!content.description) {
          return messageApi.warning("Course Description is requried");
        }
        if (!content.url) {
          return messageApi.warning("Course URL is requried");
        }
        if (content.link?.length === 0) {
          return messageApi.warning("Minimum one ourse link is required");
        }
        for (const link of content.link) {
          if (!link.title) {
            return messageApi.warning("Link title is required");
          }
          if (!link.url) {
            return messageApi.warning("Link URL is required");
          }
        }
      }

      setCurrentStep((pre) => pre + 1);
    }

    if (Object.keys(initialCourseInformation).length === 0) {
      setCurrentStep(0);
      return setTimeout(() => {
        messageApi.warning("Course Information is required");
      }, 1000);
    }
    if (courseBenifits.length === 0 || coursePrereq.length === 0) {
      setCurrentStep(1);
      return setTimeout(() => {
        messageApi.warning("Course Options are required");
      }, 1000);
    }

    const data = {
      ...initialCourseInformation,
      preRequisits: coursePrereq,
      benefits: courseBenifits,
      courseData: CourseData,
    };
    setCreateCoursePayload(data);
    setCurrentStep(3);
  };

  const handleCreateCourse = async () => {
    try {
      setloading(true);
      const res = await CreateCourseApiFn(createCoursePayload);
      if (res.data.success) {
        return messageApi.success("Course Created successfully");
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
  const handleEditCourse = async () => {
    try {
      setloading(true);
      const res = await EditCourseApi(createCoursePayload, courseToBeEdited);
      if (res.data.success) {
        return messageApi.success("Course Updated successfully");
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
    <div className="w-full flex flex-col lg:flex-row-reverse lg:justify-between">
      {contextHolder}
      <div className={` w-full lg:flex justify-center items-start`}>
        <Steps
          orientation={"vertical"}
          items={[
            { title: "Course Information" },
            { title: "Course Options" },
            { title: "Course Content" },
            { title: "Course Preview" },
          ]}
          responsive={false}
          current={CurrentStep}
          onChange={handleStepChange}
          // size= {screenWidth < 768 ? 'small' : 'default'}
          variant="filled"
          classNames={{ itemTitle: "lg:text-xl!" }}
        ></Steps>
      </div>
      {CurrentStep === 0 ? (
        <>
          {contextHolder}
          <Form
            form={form}
            name="Course Information"
            initialValues={initialCourseInformation}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="lg:w-4/5 w-full! lg:text-lg!"
            classNames={{
              label: "lg:text-lg!",
              content: "lg:text-lg!",
              root: "lg:flex! lg:flex-col! gap-y-2!",
            }}
          >
            <Form.Item<FieldType>
              label="Course Name"
              name="name"
              rules={[{ required: true, message: "Course name is required" }]}
            >
              <Input placeholder="React Mastery" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Course Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <Input.TextArea placeholder="Complete React mastery..." />
            </Form.Item>
            <Form.Item<FieldType>
              label="Price"
              name="price"
              rules={[{ required: true, message: "Course Price is required" }]}
            >
              <InputNumber
                min={1}
                className="w-full!"
                prefix="$"
                type={"number"}
                placeholder="450"
              />
            </Form.Item>
            <Form.Item<FieldType>
              label="Estimated Price (Optional)"
              name="estimatedPrice"
              className="w-full"
            >
              <InputNumber
                min={1}
                className="w-full!"
                prefix="$"
                type={"number"}
                placeholder="300"
              />
            </Form.Item>

            <div className="mb-1 text-black dark:text-white">
              Course Tags (Optional)
            </div>
            <Input
              placeholder="Complete React mastery..."
              allowClear
              onChange={handleInputChange}
              value={InputValue}
            />

            <div className="w-full flex gap-2 items-center flex-wrap my-2">
              {Tags?.length > 0 &&
                Tags.map((item: string) => {
                  return (
                    <Tag
                      key={item}
                      closable
                      color={`${tagColor()}`}
                      onClose={() => handleTagRemove(item)}
                      variant="solid"
                    >
                      {item}
                    </Tag>
                  );
                })}
            </div>
            <Form.Item<FieldType>
              label="Course Level"
              name="level"
              rules={[
                {
                  required: true,
                  message: "Course Level is required is required",
                },
              ]}
            >
              <Select
                placeholder="Beginner"
                options={[
                  { label: "Beginner", value: "beginner" },
                  { label: "Intermediate", value: "intermediate" },
                  { key: "advance", value: "Advance" },
                ]}
              ></Select>
            </Form.Item>
            <Form.Item<FieldType>
              label="Category"
              name="category"
              rules={[
                {
                  required: true,
                  message: "Category is required is required",
                },
              ]}
            >
              <Select
                placeholder="Prgramming & Tech"
                options={categoriesData?.map((item, i) => ({
                  label: item.title,
                  value: item.title.toLowerCase(),
                }))}
              ></Select>
            </Form.Item>
            <Form.Item<FieldType>
              label="Demo Video ID"
              name="demoUrl"
              rules={[{ required: true, message: "Demo Url is required" }]}
            >
              <Input
                prefix={<FaLink className="pr-2 min-w-max!" />}
                placeholder="https://www.google.com/demoUrl"
              />
            </Form.Item>

            <div className="text-black dark:text-white mb-1">
              Upload Thumbnail
            </div>
            <input
              type="file"
              hidden
              id="thumbnail"
              onChange={handleThumbnailUpload}
            />
            <label htmlFor="thumbnail" className="w-full cursor-pointer">
              <div className="border border-border-light dark:border-border-dark rounded-md cursor-pointer">
                {ThumbnailUrl ? (
                  <Image
                    src={ThumbnailUrl}
                    alt="Course Thumbnail"
                    width={0}
                    height={0}
                    className="w-full! h-full!"
                  />
                ) : (
                  <div className="py-10">
                    <div className="flex flex-col items-center! justify-center">
                      <MdUpload className="text-4xl mb-2" />
                      <p className="ant-upload-text max-w-[22ch] text-center">
                        Click or drag file to this area to upload
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </label>

            <Form.Item label={null} className="w-full flex justify-end">
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : CurrentStep === 1 ? (
        <div className="w-full">
          {contextHolder}
          <div className="mb-8">
            <div className="flex flex-col mb-3">
              <span className="">
                What are the benifites for Students in this course
              </span>
              {courseBenifits?.length === 0 && (
                <span className="text-error">(Benefits are required)</span>
              )}
            </div>
            <div className="mb-3 flex flex-col gap-y-2">
              {courseBenifits?.length > 0 &&
                courseBenifits.map((item, i) => {
                  return (
                    <div className="flex items-center" key={i}>
                      <Input
                        type="text"
                        onChange={(e) => handleBenefits(e, i)}
                        placeholder={`Benefit ${i + 1}`}
                        value={item}
                      />
                      <MdDeleteOutline
                        color="red"
                        size={30}
                        className="cursor-pointer"
                        onClick={() =>
                          setCourseBenefits((pre) =>
                            pre.filter((item, index) => index !== i)
                          )
                        }
                      />
                    </div>
                  );
                })}
            </div>
            <IoAddCircleOutline
              onClick={() => setCourseBenefits((pre) => [...pre, ""])}
              size={30}
            />
          </div>
          <div>
            <div className="flex flex-col mb-3">
              <span className="">
                What are the PreRequirements to Enter in this course
              </span>
              {coursePrereq?.length === 0 && (
                <span className="text-error">(PreRequisites are required)</span>
              )}
            </div>
            <div className="mb-3 flex flex-col gap-y-2">
              {coursePrereq?.length > 0 &&
                coursePrereq.map((item, i) => {
                  return (
                    <div className="flex items-center" key={i}>
                      <Input
                        type="text"
                        onChange={(e) => handlePreReq(e, i)}
                        placeholder={`Requirement ${i + 1}`}
                        value={item}
                      />
                      <MdDeleteOutline
                        color="red"
                        size={30}
                        className="cursor-pointer"
                        onClick={() =>
                          setCoursePrereq((pre) =>
                            pre.filter((item, index) => index !== i)
                          )
                        }
                      />
                    </div>
                  );
                })}
            </div>
            <IoAddCircleOutline
              onClick={() => setCoursePrereq((pre) => [...pre, ""])}
              size={30}
            />
          </div>
          <div className="w-full flex justify-end">
            <div className="flex gap-2">
              <Button
                variant="outlined"
                onClick={() => setCurrentStep((pre) => pre - 1)}
              >
                Previous
              </Button>
              <Button type="primary" onClick={handleNextCourseOption}>
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : CurrentStep === 2 ? (
        <div className="w-full text-xs lg:text-base">
          {contextHolder}
          <div
            className="flex items-center justify-end  gap-2 cursor-pointer font-josefin md:text-lg mb-10 text-accent"
            onClick={handleAddNewSection}
          >
            <MdAddBox size={20} />
            <div className="mt-1">Add New Section</div>
          </div>
          <div className="flex flex-col gap-y-10">
            {CourseData.length > 0 &&
              CourseData.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="px-4 md:px-10 py-6 bg-section-light dark:bg-card-dark border rounded-lg relative border-border-light dark:border-border-dark"
                  >
                    <div className="w-full flex items-start justify-between">
                      <div className="mb-6 flex items-center gap-3 flex-1">
                        {editingSectionIndex === index ? (
                          <Input
                            value={item.sectionName}
                            onChange={(e) =>
                              handleSectionNameUpdate(index, e.target.value)
                            }
                            onBlur={() => setEditingSectionIndex(null)}
                            onPressEnter={() => setEditingSectionIndex(null)}
                            placeholder="Enter section name"
                            className="text-title font-semibold border-bprimary"
                            autoFocus
                            required
                          />
                        ) : (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-title font-semibold">
                              {item.sectionName || "Untitled Section"}
                            </span>
                            <MdEdit
                              size={18}
                              className="text-bprimary cursor-pointer hover:text-bprimary-hover"
                              onClick={() => setEditingSectionIndex(index)}
                            />
                          </div>
                        )}
                      </div>
                      <TiDeleteOutline
                        color="red"
                        size={30}
                        className="cursor-pointer absolute top-0 right-0"
                        onClick={() => {
                          setSectionDeleteDialog(true);
                          setIndexOfSectionToDelete(index + 1);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-y-6 ">
                      {item.data?.length > 0 &&
                        item.data?.map((content, contentindex) => {
                          return (
                            <div className="" key={contentindex}>
                              <Collapse
                                items={[
                                  {
                                    label: (
                                      <div className="flex w-full items-center justify-between relative text-base lg:text-lg ">
                                        {content.name}{" "}
                                        <div className="">
                                          <div
                                            className="flex justify-end absolute top-0 right-0"
                                            onClick={() => {
                                              const newData = CourseData.map(
                                                (i, j) => {
                                                  if (j === index) {
                                                    return {
                                                      ...i,
                                                      data: i.data.filter(
                                                        (k, l) =>
                                                          l !== contentindex
                                                      ),
                                                    };
                                                  }
                                                  return i;
                                                }
                                              );
                                              setCourseData(newData);
                                            }}
                                          >
                                            <AiOutlineDelete
                                              className="cursor-pointer"
                                              size={20}
                                              color="red"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ),

                                    children: (
                                      <>
                                        <div className="text-xs lg:text-lg flex flex-col gap-y-3">
                                          <div>
                                            <div className="mb-1">
                                              Course Title
                                            </div>
                                            <Input
                                              type={"text"}
                                              placeholder={`Section ${
                                                contentindex + 1
                                              }`}
                                              value={content.name}
                                              onChange={(e) =>
                                                handleChange(
                                                  e,
                                                  "name",
                                                  index,
                                                  contentindex
                                                )
                                              }
                                            />
                                          </div>
                                          <div>
                                            <div className="mb-1">
                                              Video ID (VdoCipher)
                                            </div>
                                            <Input
                                              onChange={(e) =>
                                                handleChange(
                                                  e,
                                                  "url",
                                                  index,
                                                  contentindex
                                                )
                                              }
                                              value={content.url}
                                              type={"text"}
                                              placeholder={`34822085728001U349`}
                                            />
                                          </div>
                                          <div>
                                            <div className="mb-1">
                                              Video Length (In Minutes)
                                            </div>
                                            <Input
                                              onChange={(e) =>
                                                handleChange(
                                                  e,
                                                  "videoLength",
                                                  index,
                                                  contentindex
                                                )
                                              }
                                              value={content.videoLength}
                                              type={"number"}
                                              placeholder={`20`}
                                            />
                                          </div>
                                          <div>
                                            <div className="mb-1">
                                              Course Description
                                            </div>
                                            <Input.TextArea
                                              value={content.description}
                                              placeholder={`This section is about ... `}
                                              onChange={(e) =>
                                                handleChange(
                                                  e,
                                                  "description",
                                                  index,
                                                  contentindex
                                                )
                                              }
                                            />
                                          </div>
                                          <div>
                                            <div className="mb-4">
                                              Course Links
                                            </div>
                                            <div className="flex flex-col gap-y-4">
                                              {content?.link?.length > 0 &&
                                                content.link.map(
                                                  (linkitem, linkindex) => {
                                                    return (
                                                      <div key={linkindex}>
                                                        <div className="flex items-center gap-x-2 mb-1">
                                                          <FaLink />
                                                          <div className="flex items-center justify-between w-full">
                                                            <div className="">
                                                              Link{" "}
                                                              {linkindex + 1}
                                                            </div>
                                                            <IoMdRemove
                                                              size={20}
                                                              color="red"
                                                              className="cursor-pointer"
                                                              onClick={() => {
                                                                const newData =
                                                                  CourseData.map(
                                                                    (i, j) => {
                                                                      if (
                                                                        j ===
                                                                        index
                                                                      ) {
                                                                        return {
                                                                          ...i,
                                                                          data: i.data.map(
                                                                            (
                                                                              k,
                                                                              l
                                                                            ) => {
                                                                              if (
                                                                                l ===
                                                                                contentindex
                                                                              ) {
                                                                                return {
                                                                                  ...k,
                                                                                  link: k.link.filter(
                                                                                    (
                                                                                      m,
                                                                                      n
                                                                                    ) =>
                                                                                      n !==
                                                                                      linkindex
                                                                                  ),
                                                                                };
                                                                              }
                                                                              return k;
                                                                            }
                                                                          ),
                                                                        };
                                                                      }
                                                                      return i;
                                                                    }
                                                                  );
                                                                setCourseData(
                                                                  newData
                                                                );
                                                              }}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div>
                                                          <div className="mb-1 text-muted-dark">
                                                            Link Title
                                                          </div>
                                                          <Input
                                                            placeholder={`Source Code ... `}
                                                            value={
                                                              linkitem.title
                                                            }
                                                            onChange={(e) =>
                                                              handleChange(
                                                                e,
                                                                "link",
                                                                index,
                                                                contentindex,
                                                                linkindex,
                                                                "title"
                                                              )
                                                            }
                                                          />
                                                        </div>
                                                        <div>
                                                          <div className="mb-1 text-muted-dark">
                                                            Link URL
                                                          </div>
                                                          <Input
                                                            placeholder={`https://sourcecodelink.com`}
                                                            value={linkitem.url}
                                                            onChange={(e) =>
                                                              handleChange(
                                                                e,
                                                                "link",
                                                                index,
                                                                contentindex,
                                                                linkindex,
                                                                "url"
                                                              )
                                                            }
                                                          />
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                            </div>
                                          </div>
                                          <div
                                            className="flex items-center gap-x-2 cursor-pointer"
                                            onClick={() => {
                                              const newData = CourseData.map(
                                                (i, j) => {
                                                  if (j === index) {
                                                    return {
                                                      ...i,
                                                      data: i.data.map(
                                                        (k, l) => {
                                                          if (
                                                            l === contentindex
                                                          ) {
                                                            return {
                                                              ...k,
                                                              link: [
                                                                ...k.link,
                                                                {
                                                                  title: "",
                                                                  url: "",
                                                                },
                                                              ],
                                                            };
                                                          }
                                                          return k;
                                                        }
                                                      ),
                                                    };
                                                  }
                                                  return i;
                                                }
                                              );
                                              setCourseData(newData);
                                            }}
                                          >
                                            <MdOutlineAddLink />
                                            <div>Add Link</div>
                                          </div>
                                        </div>
                                      </>
                                    ),
                                  },
                                ]}
                              ></Collapse>
                            </div>
                          );
                        })}
                    </div>
                    <div
                      className="flex items-center mt-10 mb-2 gap-2 cursor-pointer text-accent"
                      onClick={() => {
                        const newData = CourseData.map((i, j) => {
                          if (j === index) {
                            return {
                              ...i,
                              data: [
                                ...i.data,
                                {
                                  name: "UnNamed",
                                  description: "",
                                  link: [{ title: "", url: "" }],
                                  url: "",
                                  videoLength: 0,
                                },
                              ],
                            };
                          }
                          return i;
                        });
                        setCourseData(newData);
                      }}
                    >
                      <IoIosAddCircleOutline size={20} className="" />
                      Add New Content
                    </div>
                  </div>
                );
              })}
          </div>

          <Modal
            title={
              <div className="text-center text-title">
                Delete <span className="text-accent">Course Section</span>
              </div>
            }
            open={sectionDeleteDialog}
            closeIcon
            onCancel={() => setSectionDeleteDialog(false)}
            footer={null}
          >
            <div className="text-center mb-4">
              Are you sure to delete this course section ?
            </div>
            <div className="w-full flex justify-end gap-x-2">
              <Button
                variant="outlined"
                onClick={() => setSectionDeleteDialog(false)}
              >
                No
              </Button>
              <Button
                variant="filled"
                color="red"
                onClick={handleDeleteSection}
              >
                Delete
              </Button>
            </div>
          </Modal>
          <div className="w-full flex justify-end gap-x-2">
            <Button
              variant="outlined"
              onClick={() => setCurrentStep((pre) => pre - 1)}
            >
              Previous
            </Button>
            <Button
              variant="solid"
              type="primary"
              onClick={handleNextCourseContent}
            >
              Next
            </Button>
          </div>
        </div>
      ) : CurrentStep === 3 ? (
        <div className="w-full mb-20 lg:text-lg flex flex-col gap-y-6 text-primary-light dark:text-primary-dark">
          <div className="aspect-video">

          <VideoPlayer demoUrl={createCoursePayload.demoUrl} />
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-lg lg:text-xl font-bold">
              {createCoursePayload.price === 0
                ? "Free"
                : `${createCoursePayload.price}$`}
            </div>
            <div className="line-through dark:text-muted-dark text-muted-light">
              {createCoursePayload.price === 0
                ? ""
                : createCoursePayload.estimatedPrice
                ? `${createCoursePayload.estimatedPrice}$`
                : `${createCoursePayload.price}$`}
            </div>
            <div className="text-error tracking-tighter">
              {!createCoursePayload.price &&
                (createCoursePayload.estimatedPrice
                  ? `${
                      ((createCoursePayload.estimatedPrice -
                        createCoursePayload.price) /
                        createCoursePayload.estimatedPrice) *
                      100
                    }% OFF`
                  : "0% OFF")}
            </div>
          </div>
          <Button
            variant="outlined"
            type="primary"
            color="green"
            block={false}
            className="max-w-max"
          >
            Buy Now {createCoursePayload.price}$
          </Button>
          <div className="flex gap-2">
            <Input type={"text"} placeholder="Discount Code" />
            <Button variant="filled" type="primary">
              Apply
            </Button>
          </div>
          <div className="dark:text-muted-dark text-muted-light">
            <div className="">Source Code included</div>
            <div>Full life time access</div>
            <div>Certificate of completion</div>
            <div>Premium Support</div>
          </div>
          <div className="text-title text-bprimary">
            {createCoursePayload.name}
          </div>
          <div>Here is going to be the reviews section</div>
          <div>
            <div className="text-accent">
              What you will learn from this course ?
            </div>
            <div>
              {createCoursePayload.benefits.map((item, i) => {
                return (
                  <div className="flex gap-x-3 items-center">
                    <LiaCheckDoubleSolid color="gray" />
                    <div>{item}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-accent">
              What are the PreRequisits before starting this course ?
            </div>
            <div>
              {createCoursePayload.preRequisits.map((item, i) => {
                return (
                  <div className="flex gap-x-3 items-center">
                    <LiaCheckDoubleSolid color="gray" />
                    <div>{item}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-accent">Course Details</div>
            <div>{createCoursePayload.description}</div>
          </div>
          <div className="flex justify-between lg:justify-end gap-x-3 w-full">
            <Button
              variant="outlined"
              onClick={() => setCurrentStep((pre) => pre - 1)}
            >
              GO Back
            </Button>
            {courseToBeEdited ? (
              <Button
                type="primary"
                variant="filled"
                onClick={handleEditCourse}
                loading={loading}
                icon
                iconPlacement="end"
              >
                Update Course
              </Button>
            ) : (
              <Button
                type="primary"
                variant="filled"
                onClick={handleCreateCourse}
                loading={loading}
                icon
                iconPlacement="end"
              >
                Create Course
              </Button>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CreateCourse;
