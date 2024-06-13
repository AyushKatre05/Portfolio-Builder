"use client";

import { db } from "@/utils";
import { userInfo } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import FormContent from "./_components/FormContent";
import MobilePreview from "./_components/MobilePreview";

const Admin = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    user && CheckUser();
  }, [user]);

  const CheckUser = async () => {
    const result = await db
      .select()
      .from(userInfo)
      .where(eq(userInfo.email, user?.primaryEmailAddress?.emailAddress));
    console.log(user);
    if (result?.length == 0) {
      router.replace("/create");
    }
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="col-span-2 ">
          <FormContent/>
        </div>
        <div>
          <MobilePreview/>
        </div>
      </div>
    </div>
  );
};

export default Admin;
