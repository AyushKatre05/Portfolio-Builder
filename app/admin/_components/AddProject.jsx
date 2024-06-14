import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { db } from '@/utils';
import { project } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { Link2 } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

const AddProject = ({refreshData}) => {
    const [openUrlInput, setOpenUrlInput] = useState(false);
    const { user } = useUser();
    const { userDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await db.insert(project).values({
                url: e.target.url.value,
                emailRef: user?.primaryEmailAddress.emailAddress,
                userRef: userDetail?.id,
                active: true // Ensuring active field is set correctly
            });
            setLoading(false);
            setOpenUrlInput(false);
            refreshData();
            toast.success('New Project Created', {
                position: 'top-right'
            });
        } catch (error) {
            setLoading(false);
            console.error('Error inserting project:', error);
            toast.error('Failed to create project', {
                position: 'top-right'
            });
        }
    };

    return (
        <div>
            {!openUrlInput ? (
                <button onClick={() => setOpenUrlInput(true)} className='btn btn-primary w-full'>
                    + Add New Project
                </button>
            ) : (
                <form onSubmit={handleSubmit} className='p-3 rounded-lg bg-gray-800'>
                    <label className="input input-bordered flex items-center gap-2 my-3">
                        <Link2 />
                        <input type="url" name="url" defaultValue={'https://'} className="grow" placeholder="URL" required />
                    </label>
                    <button disabled={loading} type='submit' className='btn btn-primary w-full'>
                        + Add New Project
                    </button>
                </form>
            )}
        </div>
    );
};

export default AddProject;
