"use client"

import { db } from '@/utils'
import { userInfo } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { UserDetailContext } from '../_context/UserDetailContext'

const Provider = ({children}) => {

    const {user} = useUser();
    const [userDetail,setUserDetail] = useState([]);

    useEffect(()=>{
        user && getUserDetails();
    },[user])

    const getUserDetails=async()=>{
        const result = await db.select().from(userInfo).where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress))
        setUserDetail(result[0])
    }

  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
    <div>{children}</div>
    </UserDetailContext.Provider>
  )
}

export default Provider