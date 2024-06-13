import React from 'react'
import Sidenav from './_components/Sidenav'

const AdminLayout = ({children}) => {
  return (
    <div>
        <div className='w-24 fixed'>
    <Sidenav/>
    </div>
    <div className='ml-24'>
    {children}</div>
    </div>
  )
}

export default AdminLayout