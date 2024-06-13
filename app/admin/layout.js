import React from "react";
import Sidenav from "./_components/Sidenav";
import Provider from "./Provider";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <div className="w-24 fixed">
        <Sidenav />
      </div>
      <div className="ml-24">
        <Provider>{children}</Provider>
      </div>
    </div>
  );
};

export default AdminLayout;
