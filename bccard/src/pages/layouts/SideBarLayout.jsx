import React from "react";
import SideBar from "./SideBar";

function SideBarLayout(props) {
  return (
    <div style={{ height: "100%" }}>
      <aside>
        <SideBar />
      </aside>
      <div style={{ marginLeft: "var(--sidebar-width)", height: "100%" }}>
        {props.children}
      </div>
    </div>
  );
}

export default SideBarLayout;
