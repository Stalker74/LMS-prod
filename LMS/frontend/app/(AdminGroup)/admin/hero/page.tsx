"use client";

import { CreateLayoutApi, GetLayoutDataApi, UpdateLayoutApi } from "@/app/APIs/routes";
import { dispatchHeroSection } from "@/app/Redux/Layout";
import { Button, Input, message } from "antd";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdUpload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const Hero = () => {
  const reduxStoredHero = useSelector((state:any)=>state.LayoutReducer.hero)
  const [bannerImage, setBannerImage] = useState(reduxStoredHero?.image || '');
  console.log('banner image is',bannerImage)
  const [base64ImageUrl, setbase64ImageUrl] = useState("");
  console.log("image", bannerImage, "BASE64", base64ImageUrl);
  const [loading, setloading] = useState(false);
  const [heroSectionPayload, setHeroSectionPayload] = useState({
    image: reduxStoredHero?.image || '',
    title: reduxStoredHero?.title || '',
    subtitle: reduxStoredHero?.subtitle || '',
  });
  console.log('hero section payload',heroSectionPayload)
  const [TitleErrorMessage, setTitleErrorMessage] = useState("");
  const [SubtitleErrorMessage, setSubtitleErrorMessage] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [heroAlreadyCreated, setHeroAlreadyCreated] = useState(false)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(reduxStoredHero?.image &&  reduxStoredHero?.image &&reduxStoredHero?.image){
      setHeroAlreadyCreated(true)
    }
  },[])

  // useEffect(()=>{
  //   const fetchHeroData = async()=>{
  //        try {
  //     setloading(true);
  //     const res = await GetLayoutDataApi({
  //       type: "banner",
  //     });
  //     if (res.data.success) {
  //       const data =  res.data.data.banner
  //       setHeroAlreadyCreated(true)
  //       setHeroSectionPayload({...data,image:data.image.url})
  //       setBannerImage(data.image.url)
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       return messageApi.error(
  //         error.response?.data?.message ||
  //           "Something went wrong, Please try again later"
  //       );
  //     }
  //   } finally {
  //     setloading(false);
  //   }
  //   }
  //   fetchHeroData()
  // },[])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "title" && value === "") {
      setTitleErrorMessage("Title is required");
    } else {
      setTitleErrorMessage("");
    }

    if (name === "subtitle" && value === "") {
      setSubtitleErrorMessage("Subtitle is required");
    } else {
      setSubtitleErrorMessage("");
    }

    setHeroSectionPayload((pre) => ({ ...pre, [name]: value }));
  };
  const handleHeroBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const bannerImage = URL.createObjectURL(file as any);
    setBannerImage(bannerImage);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setbase64ImageUrl(base64Image as any);
      setHeroSectionPayload(pre=>({...pre,image:base64Image as any}))
    };
    reader.readAsDataURL(file as any);
  };

  const handleCreateHero = async () => {
    if (!heroSectionPayload.title) {
      return messageApi.warning("Hero section title is required");
    }
    if (!heroSectionPayload.subtitle) {
      return messageApi.warning("Hero section subtitle is required");
    }
    if (!heroSectionPayload.image) {
      return messageApi.warning("Hero section image is required");
    }

    try {
      setloading(true);
      let res;
      heroAlreadyCreated ? 

      res = await UpdateLayoutApi({
        type: "banner",
        banner: heroSectionPayload,
      })
      :
      res = await CreateLayoutApi({
        type: "banner",
        banner: heroSectionPayload,
      }) 
      
      if (res.data.success) {
        const data = res.data.data.banner
        messageApi.success("Hero Section created successfully");
        dispatch(dispatchHeroSection({...data,image:data.image.url}))
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
    <div className="flex flex-col gap-y-4">
      {contextHolder}
      <div className="">
        <div className="mb-1 md:mb-2">Hero Section Title</div>
        <Input
          placeholder="Enter Hero Title..."
          name="title"
          value={heroSectionPayload.title}
          onChange={handleInputChange}
        />
        <div className="text-error text-sm">{TitleErrorMessage}</div>
      </div>
      <div className="">
        <div className="mb-1 md:mb-2">Hero Section Subtitle</div>
        <Input
          placeholder="Enter Hero Title..."
          name="subtitle"
          value={heroSectionPayload.subtitle}
          onChange={handleInputChange}
        />
        <div className="text-error text-sm">{SubtitleErrorMessage}</div>
      </div>

      <div>
        <div className="mb-1 md:mb-2">
          {bannerImage ? "Change Hero Image" : "Upload Hero Image"}
        </div>
        <input
          type="file"
          id="hero-image"
          hidden
          onChange={handleHeroBanner}
          accept="image/*"
          multiple={false}
        />
        <div className="border border-border-light dark:border-border-dark cursor-pointer relative h-64! md:h-72!">
          <label htmlFor="hero-image" className="w-full! cursor-pointer">
            {bannerImage ? (
              <Image
                src={bannerImage}
                alt="hero-image"
                fill
                className="w-full object-contain"
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
          </label>
        </div>
      </div>
      <div className="flex">
        <Button
          variant="solid"
          type="primary"
          block
          loading={loading}
          icon
          iconPlacement="end"
          onClick={handleCreateHero}
        >
          {heroAlreadyCreated ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

export default Hero;
