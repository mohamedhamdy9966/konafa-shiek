import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const AdminSidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/admin/add"
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="addIcon" />
          <p className="hidden md:block">Add Product</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/admin/list"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="addIcon" />
          <p className="hidden md:block">List Items</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/admin/orders"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="addIcon" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;