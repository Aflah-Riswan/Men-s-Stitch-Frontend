import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      <div className="w-75 flex-shrink-0 h-full border-r border-gray-200 bg-white">
        <AdminSidebar />
      </div>


      <div className="flex-1 min-w-0 h-full overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
}