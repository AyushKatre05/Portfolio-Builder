import { db } from '@/utils';
import { userInfo } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { Camera } from 'lucide-react'
import React from 'react'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const UserDetail = () => {

    let timeoutId;

    const {user} = useUser();

    const onInputChange = (e,fieldName)=>{
        clearTimeout(timeoutId)
     timeoutId = setTimeout(async()=>{
        const result = await db.update(userInfo).set({
            [fieldName]:e.target.value
        }).where(eq(userInfo.email,user?.primaryEmailAddress?.emailAddress));
        if(result){
            toast.success('Saved',{
                position:'top-right'
            })
        }
        else{
            toast.error('Error!',{
                position:'top-right'
            })
        }
     },1000)
    }

  return (
    <div className='p-7 rounded-lg bg-gray-800 my-7'>
        <div className='flex gap-5 items-center'>
        <Camera className='p-3 h-12 w-12 bg-gray-500 rounded-full'/>
        <input onChange={(e)=>onInputChange(e,'name')} type="text" placeholder="Username" className="input input-bordered w-full max-w-full" />
        </div>
        <textarea onChange={(e)=>onInputChange(e,'bio')} className="textarea textarea-bordered mt-3 w-full" placeholder="Write about yourself"></textarea>
    </div>
  )
}

export default UserDetail