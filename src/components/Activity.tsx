import React from "react";
import SuggestedUsers from "./SuggestedUsers";
import ActiveUsers from "./ActiveUsers";

function Activity() {
  return (
    <div className="flex flex-col gap-4 h-auto pt-4 pr-4">
      <SuggestedUsers />

      <ActiveUsers />
    </div>
  );
}

export default Activity;
