'use client'

import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { IoMoonOutline } from 'react-icons/io5'
import { MdOutlineWbSunny } from 'react-icons/md'

type Props = {}

function ThemeChanger({}: Props) {
    const {theme, setTheme, systemTheme, resolvedTheme} = useTheme()
    const [mounted, setmounted] = useState(false)
    useEffect(() => {
      setmounted(true)
      setTheme(systemTheme as any)
    }, [systemTheme])
    if(!mounted) return null;
    
  return (
    <button onClick={()=>setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {
            theme === 'dark' ? 
            <MdOutlineWbSunny  className="cursor-pointer text-2xl md:text-3xl"/> :
            <IoMoonOutline  className="cursor-pointer text-2xl md:text-3xl"/>
        }
    </button>
  )
}

export default ThemeChanger