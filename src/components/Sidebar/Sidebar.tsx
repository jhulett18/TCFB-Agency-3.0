import React, { useState, useEffect } from "react";
import { Sidebar, Menu } from "react-pro-sidebar";
import SidebarHeader from "./SidebarHeader/SidebarHeader";
import FormInput from "./FormInput/FormInput";
import AgencyList from "../AgencyList/AgencyList";
import "./Sidebar.css"; // custom styles

export default function LeftSidebar() {
  const [sidebarWidth, setSidebarWidth] = useState(
    window.innerWidth > 750 ? "600px" : "100vw"
  );

  useEffect(() => {
    const handleResize = () => {
      setSidebarWidth(window.innerWidth > 750 ? "600px" : "100vw");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Sidebar width={sidebarWidth} className="sidebar">
      <Menu>
        <SidebarHeader />
        <FormInput />
        <div className="agency-scroll-container">
          <AgencyList />
        </div>
      </Menu>
    </Sidebar>
  );
}
