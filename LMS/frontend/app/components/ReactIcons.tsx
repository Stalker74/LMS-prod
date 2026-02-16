"use client";

import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
import { TiTick } from "react-icons/ti";



export const ProfileIcon = () => {
  return (
    <CgProfile className="cursor-pointer text-2xl md:text-3xl" />
  );
};
export const SearchIcon = () => {
  return (
    <IoSearch className="cursor-pointer text-2xl md:text-3xl" />
  );
};
export const TickIcon = () => {
  return (
    <TiTick className="cursor-pointer text-black text-2" />
  );
};
