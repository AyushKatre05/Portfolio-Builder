import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { db } from "@/utils";
import { storage } from "@/utils/firebaseConfig";
import { userInfo } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ref, uploadBytes } from "firebase/storage";
import { Camera, Link2, MapPin } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL =
  "https://firebasestorage.googleapis.com/v0/b/portfolio-builder-ebc0d.appspot.com/o/";

const UserDetail = () => {
  let timeoutId;

  const { user } = useUser();

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [selectedOption, setSelectedOption] = useState();
  const [profileImage, setProfileImage] = useState();
  useEffect(() => {
    userDetail && setProfileImage(userDetail?.profileImage);
  }, [userDetail]);

  const onInputChange = (e, fieldName) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const result = await db
        .update(userInfo)
        .set({
          [fieldName]: e.target.value,
        })
        .where(eq(userInfo.email, user?.primaryEmailAddress?.emailAddress));
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    const fileName = Date.now().toString() + "." + file.type.split("/")[1];
    const storageRef = ref(storage, fileName);
    uploadBytes(storageRef, file).then(
      async (snapshot) => {
        const result = await db
          .update(userInfo)
          .set({
            profileImage: fileName + "?alt=media",
          })
          .where(eq(userInfo.email, user?.primaryEmailAddress.emailAddress));
        if (result) {
          setProfileImage(fileName + "?alt=media");
          toast.success("saved", {
            position: "top-right",
          });
        }
      },
      (e) => console.log(e)
    );
  };

  return (
    <div className="p-7 rounded-lg bg-gray-800 my-7">
      <div className="flex gap-5 items-center">
        {profileImage ? (
          <label htmlFor="file-input" className="cursor-pointer">
          <Image
            src={BASE_URL + profileImage}
            width={40}
            height={40}
            alt="profile_image"
            htmlFor="file-input"
          />
          </label>
        ) : (
          <div>
          <label htmlFor="file-input">
              <Camera className="p-3 h-12 w-12 bg-gray-500 rounded-full cursor-pointer" />
            </label>
            
          </div>
        )}
        <input
              accept="image/png,image/gif,image/jpeg,image/jpg"
              onChange={handleFileUpload}
              type="file"
              id="file-input"
              style={{ display: "none" }}
            />
        <input
          defaultValue={userDetail?.name}
          onChange={(e) => onInputChange(e, "name")}
          type="text"
          placeholder="Username"
          className="input input-bordered w-full max-w-full"
        />
      </div>
      <textarea
        defaultValue={userDetail?.bio}
        onChange={(e) => onInputChange(e, "bio")}
        className="textarea textarea-bordered mt-3 w-full"
        placeholder="Write about yourself"
      ></textarea>
      <div>
        <div className="flex gap-3">
          <MapPin
            onClick={() => setSelectedOption("location")}
            className={`h-14 w-14 p-3 rounded-md text-blue-500 hover:bg-gray-600 ${
              selectedOption == "location" && "bg-slate-600"
            }`}
          />
          <Link2
            onClick={() => setSelectedOption("link")}
            className={`h-14 w-14 p-3 rounded-md text-blue-500 hover:bg-gray-600 ${
              selectedOption == "link" && "bg-slate-600"
            }`}
          />
        </div>
        {selectedOption == "location" ? (
          <div className="mt-2">
            <label className="input input-bordered flex items-center gap-2">
              <MapPin />
              <input
                key={1}
                defaultValue={userDetail?.location}
                type="text"
                className="grow"
                placeholder="Location"
                onChange={(e) => onInputChange(e, "location")}
              />
            </label>
          </div>
        ) : selectedOption == "link" ? (
          <div className="mt-2">
            <label className="input input-bordered flex items-center gap-2">
              <Link2 />
              <input
                key={2}
                defaultValue={userDetail?.link}
                type="text"
                className="grow"
                placeholder="Url"
                onChange={(e) => onInputChange(e, "link")}
              />
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserDetail;
