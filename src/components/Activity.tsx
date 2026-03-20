import React from "react";
import SuggestedUsers from "./SuggestedUsers";

function Activity() {
  return (
    <div className="flex flex-col gap-6 h-screen pt-4 pr-4">
      <SuggestedUsers />

      <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Activity</h3>
        <p className="text-xs text-gray-400">No recent activity</p>
      </div>
    </div>
  );
}

export default Activity;
