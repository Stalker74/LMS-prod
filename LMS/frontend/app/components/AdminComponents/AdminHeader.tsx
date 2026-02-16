import ThemeChanger from '@/utils/ThemeChanger'
import React from 'react'

const AdminHeader = () => {
  return (
    <div className='w-full h-20 flex items-center justify-end '>
        <ThemeChanger />
        
    </div>
  )
}

export default AdminHeader