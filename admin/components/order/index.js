import React from "react";
import SearchOrder from "./SearchOrder";
import OrderDropDownload from "./OrderDropDownload";
import AllOrder from "./OrderList";
import { selectUser } from "@/app/redux/slices/authSlice";
import { useSelector } from "react-redux";

const Order = () => {
  const user = useSelector(selectUser);
  return (
    <main>
      <div className="grid mx-auto">
        <h1 className="mb-3 text-lg font-bold text-gray-700 ">Orders</h1>
        <SearchOrder />
        {user.staff_role === "HR" && <OrderDropDownload />}
        <AllOrder />
      </div>
    </main>
  );
};

export default Order;
