"use client"

import { db } from '@/utils';
import { userInfo } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const CreateUsername = () => {

    const [username,setusername] = useState();
  const {user} = useUser();
  const router = useRouter();

  useEffect(()=>{
    user && CheckUser();
},[user])

  const CheckUser=async()=>{
    const result = await db.select().from(userInfo)
    .where(eq(userInfo.email,user?.primaryEmailAddress?.emailAddress))
    console.log(user)
    if(result?.length>0){
        router.replace('/admin')
    }
}

    const OnCreate=async()=>{
        if(username.length>10){
          toast.error("Username should be less than 10 chars ", {
            position: "top-right"
          });
            return;
        }
        const result = await db.insert(userInfo).values({
          name:user?.fullName,
          email:user?.primaryEmailAddress?.emailAddress,
          username:username.replace(' ','')
        })

        if(result){
          toast.success("Username created successfully", {
            position: "top-right"
          });
          router.replace('/admin')
        }
    }

  return (
    <div className='flex items-center justify-center h-screen'><div className='p-10 border rounded-lg flex flex-col'>
        <h2 className='font-bold text-2xl py-3 text-center'>Create Username</h2>
        <label> Add Username</label>
        <input onChange={(e)=>setusername(e.target.value)} type="text" placeholder="Type here" className="input input-bordered py-2 w-full max-w-xs" />
        <button onClick={()=>OnCreate()} disabled={!username} className="btn btn-primary mt-3">Create</button>
    </div></div>
  )
}

export default CreateUsername