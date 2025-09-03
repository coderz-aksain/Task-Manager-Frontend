import React from "react";

export default function LineLoaderTable() {
  return (
    <div className="w-full relative">
      <table className="w-full rounded-lg">
        {/* <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Task ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Task Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Task Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Priority</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Assigned To</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Due Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead> */}
      </table>

      {/* Line Loader */}
      <div className="w-full h-1 bg-gray-200 relative overflow-hidden mt-2 rounded">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-blue-500 animate-lineLoader"></div>
      </div>
    </div>
  );
}
