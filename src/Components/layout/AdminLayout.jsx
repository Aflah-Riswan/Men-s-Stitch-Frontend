import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* FIX 1: Sidebar Container 
          - w-64: Explicit width (Adjust this if your sidebar is wider/narrower)
          - flex-shrink-0: CRITICAL. This tells Flexbox "Never shrink this div, no matter what."
      */}
      <div className="w-64 flex-shrink-0 h-full border-r border-gray-200 bg-white">
        <AdminSidebar />
      </div>

      {/* FIX 2: Content Container
          - flex-1: "Take whatever space is left"
          - min-w-0: Prevents the child form from forcing this container to expand beyond the screen width
          - overflow-auto: Allows scrolling INSIDE this box only
      */}
      <div className="flex-1 min-w-0 h-full overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
}