import { db } from "@/utils";
import { storage } from "@/utils/firebaseConfig";
import { project } from "@/utils/schema";
import { TwicPicture } from "@twicpics/components/react";
import { eq } from "drizzle-orm";
import { ref, uploadBytes } from "firebase/storage";
import { Link2, SquareStack, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ProjectListEdit = ({ projectList,refreshData }) => {
  const [selectedOption, setSelectedOption] = useState();
  let timeoutId;

  const onInputChange = (value, fieldName, projectId) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const result = await db
        .update(project)
        .set({
          [fieldName]: value,
        })
        .where(eq(project.id, projectId));
      if (result) {
        toast.success("Saved", {
          position: "top-right",
        });
      } else {
        toast.error("Error!", {
          position: "top-right",
        });
      }
    }, 1000);
  };

  const handleFileUploadForProject = (e,projectId) => {
    const file = e.target.files[0];

    const fileName = Date.now().toString() + "." + file.type.split("/")[1];
    const storageRef = ref(storage, fileName);
    uploadBytes(storageRef, file).then(
      async (snapshot) => {
        const result = await db
          .update(project)
          .set({
            logo: fileName + "?alt=media",
          })
          .where(eq(project.id, projectId));
        if (result) {
            refreshData();
          //   setProfileImage(fileName + "?alt=media");
          toast.success("saved", {
            position: "top-right",
          });
        }
      },
      (e) => console.log(e)
    );
  };


  const onProjectDelete=(projectId)=>{
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async(result) => {
        if (result.isConfirmed) {
            const result = await db.delete(project).where(eq(project.id,projectId))
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          refreshData();
          toast.error("Deleted", {
            position: "top-right",
          });
        }
      });
  }

  return (
    <div className="mt-10">
      {projectList.map((project, index) => (
        <div className="my-7 p-5 bg-slate-800 rounded-lg" key={index}>
          <div className="flex items-center gap-3">
            <label htmlFor={"project-file-input"+index} className="cursor-pointer">
              <TwicPicture
                src={project.logo}
                className="w-10 h-10 rounded-full"
              ></TwicPicture>
            </label>
            <input
              accept="image/png,image/gif,image/jpeg,image/jpg"
              onChange={(e)=>handleFileUploadForProject(e,project.id)}
              type="file"
              id={"project-file-input"+index}
              style={{ display: "none" }}
            />
            <input
              type="text"
              placeholder="Project Name"
              defaultValue={project.name}
              onChange={(e) => onInputChange(e.target.value, "name", project.id)}
              className="input input-bordered w-full my-2"
            />
          </div>
          <input
            type="text"
            placeholder="Description"
            defaultValue={project.desc}
            onChange={(e) => onInputChange(e.target.value, "desc", project.id)}
            className="input input-bordered w-full text-sm"
          />
          <div>
            <div className="flex gap-3 mt-3 items-center justify-between">
            <div className="flex gap-3 mt-3">
            <Link2
                onClick={() => setSelectedOption("link" + index)}
                className={`h-14 w-14 p-3 rounded-md text-blue-500 hover:bg-gray-600 ${
                  selectedOption == "link" && "bg-slate-600"
                }`}
              />
              <SquareStack
                onClick={() => setSelectedOption("category" + index)}
                className={`h-14 w-14 p-3 rounded-md text-blue-500 hover:bg-gray-600 ${
                  selectedOption == "category" && "bg-slate-600"
                }`}
              />
            </div>
            <div className="flex gap-3 items-center">
              <button className="btn btn-error btn-sm" onClick={()=>onProjectDelete(project.id)}><Trash2/></button>
              <input type="checkbox" className="toggle toggle-success" defaultChecked={project.active} 
              onChange={(e) => onInputChange(e.target.checked, "active", project.id)}
              />
              </div>
            </div>
            {selectedOption == "link" + index ? (
              <div className="mt-2">
                <label className="input input-bordered flex items-center gap-2">
                  <Link2 />
                  <input
                    key={1}
                    defaultValue={project?.url}
                    type="text"
                    className="grow"
                    placeholder="Url"
                    onChange={(e) => onInputChange(e.target.value, "url", project.id)}
                  />
                </label>
              </div>
            ) : selectedOption == "category" + index ? (
              <div className="mt-2">
                <label className="input input-bordered flex items-center gap-2">
                  <SquareStack />
                  <input
                    key={2}
                    defaultValue={project?.category}
                    type="text"
                    className="grow"
                    placeholder="Category"
                    onChange={(e) => onInputChange(e.target.value, "category", project.id)}
                  />
                </label>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectListEdit;
