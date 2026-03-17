import React from "react";
import Sidebar from "../components/Sidebar";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar  */}
      <div className="w-64 border-r border-mehfil-border p-6">
        <Sidebar />
      </div>

      {/* Feed  */}
      <div className="flex-1 max-w-xl mx-auto p-6">{children}</div>

      {/* Right Panel  */}
      <div className="w-80 border-l border-mehfil-border p-6">Activity</div>
    </div>
  );
}

export default MainLayout;
