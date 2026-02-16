'use client'

import { persistor } from '@/app/Redux/store'
import { ReactNode } from 'react'
import { PersistGate } from 'redux-persist/integration/react'

function PersistGateProvider({children}:{children:ReactNode}) {
  return (
    <PersistGate persistor={persistor}>{children}</PersistGate>
  )
}

export default PersistGateProvider