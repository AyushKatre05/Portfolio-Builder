import React, { useState,useEffect } from 'react'
import UserDetail from './UserDetail'
import AddProject from './AddProject'
import { db } from '@/utils'
import { project } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import ProjectListEdit from './ProjectListEdit'

const FormContent = () => {

  const {user} = useUser();
  const [projectList,setProjectList] = useState([]);

  useEffect(()=>{
    user && GetProjectList();
  },[user])

  const GetProjectList =async()=>{
    const result = await db.select().from(project).where(eq(project.emailRef,user?.primaryEmailAddress.emailAddress)).orderBy(desc(project.id))
    setProjectList(result)
    console.log(result)
  }

  return (
    <div className='py-12 px-6 overflow-auto'>
      <h2 className='text-3xl font-bold'>Start Designing Your Portfolio</h2>
      <UserDetail/>
      <hr className='my-5'></hr>
      <AddProject refreshData={GetProjectList}/>
      <ProjectListEdit projectList={projectList} refreshData={GetProjectList}/>
    </div>
  )
}

export default FormContent