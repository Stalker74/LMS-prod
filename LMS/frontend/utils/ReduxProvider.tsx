
'use client'

import { store } from '@/app/Redux/store'
import { Store } from '@reduxjs/toolkit'
import { ReactNode } from 'react'
import {Provider} from 'react-redux'

const ReduxProvider = ({children}:{children:ReactNode})=>{
    return <Provider store={store}>{children}</Provider>
}  

export default ReduxProvider