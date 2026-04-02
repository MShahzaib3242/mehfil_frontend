import { Search } from "lucide-react";
import React from "react";

function Header() {
  return (
    <div className="sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 w-full max-w-md">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>
    </div>
  );
}

export default Header;
