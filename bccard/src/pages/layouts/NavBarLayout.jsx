import React from "react";
import Nav from "./Nav";

/*
    Nav와 내부페이지로 구성된 기본 레이아웃
*/
function NavBarLayout(props) {
  return (
    <div>
      <div
        style={{
          position: "fixed",
          width: "100%",
          top: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          zIndex: 100,
        }}
      >
        <Nav />
      </div>
      <div style={{ marginTop: "var(--nav-height)" }}>{props.children}</div>
    </div>
  );
}

export default NavBarLayout;
