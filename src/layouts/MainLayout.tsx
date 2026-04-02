import React from "react";
import Sidebar from "../components/Sidebar";
import Activity from "../components/Activity";
import Header from "../components/Header";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar  */}
      <div className="sticky top-0 max-h-screen overflow-y-auto border-r bg-white">
        <Sidebar />
      </div>
      {/* Sticky Header  */}
      <div className="flex-1">
        <Header />

        <div className="flex">
          {/* Feed  */}
          <div className="flex-1 p-4 overflow-auto">{children}</div>

          {/* Right Panel  */}
          <div className="w-80">
            <div className="sticky top-11 h-auto overflow-y-auto">
              <Activity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
