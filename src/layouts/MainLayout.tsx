import React from "react";
import Sidebar from "../components/Sidebar";
import Activity from "../components/Activity";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar  */}
      <div className="w-64 border-r bg-white">
        <div className="sticky top-0 max-h-screen overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* Feed  */}
      <div className="flex-1 p-4">{children}</div>

      {/* Right Panel  */}
      <div className="w-80">
        <div className="sticky top-0 max-h-screen overflow-y-auto">
          <Activity />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
