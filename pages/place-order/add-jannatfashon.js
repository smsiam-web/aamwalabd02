import React from "react";
import AdminLayout from "@/admin/AdminLayout";
import AddJFOrder from "@/admin/components/placeOrder/jannatFashon";
import Link from "next/link";
import { BsArrowLeftShort } from "react-icons/bs";

const JFOrder = () => {
  return (
    <AdminLayout>
      <Link href={"/place-order"}>
        <div className="flex max-w-2xl mx-auto items-center justify-start text-sub-title">
          <BsArrowLeftShort size={22} />
          <span>Back</span>
        </div>
      </Link>
      <AddJFOrder className="pt-10" />
    </AdminLayout>
  );
};

export default JFOrder;