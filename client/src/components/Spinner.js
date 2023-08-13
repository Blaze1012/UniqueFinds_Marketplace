import React from "react";

function Spinner() {
  return (
    <div className="fixed inset-0 bg-black z-10 flex items-center justify-center opacity-70">
      <div className="w-20 h-20 border-4 border-solid border-gray-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;
