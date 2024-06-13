import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { db } from '@/utils';
import { project } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { Link2 } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';

const AddProject = () => {

    const [openUrlInput,setOpenUrlInput] = useState(false);
    const {user} = useUser();
    const {userDetail,setUserDetail} = useContext(UserDetailContext)
    const [loading,setLoading] = useState(false);

    const handleSubmit =async(e)=>{
        e.preventDefault();
        setLoading(true);
        const result = await db.insert(project).values({
            url:e.target[0].value,
            emailRef:user?.primaryEmailAddress.emailAddress,
            userRef:userDetail?.id
        })
        setOpenUrlInput(false);
        if(result){
            setLoading(false);
            toast.success('New Project Created',{
                position:'top-right'
            })
        }
        else{
            setLoading(false)
        }
    }
  return (
    <div>
        {!openUrlInput ? <button onClick={()=>setOpenUrlInput(true)} className='btn btn-primary w-full'>+ Add New Project</button> : 
        <form onSubmit={handleSubmit} className='p-3 rounded-lg bg-gray-800'>
        <label className="input input-bordered flex items-center gap-2 my-3">
        <Link2/>
  <input type="url" defaultValue={'https://'} className="grow" placeholder="Email" />
</label>
        <button disabled={loading} type='submit' className='btn btn-primary w-full'>+ Add New Project</button>
        </form>}
    </div>
  )
}

export default AddProject