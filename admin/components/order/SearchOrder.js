import React, { useEffect, useState, useRef } from "react";
import Button from "@/app/components/shared/Button";
import { AiOutlineAppstoreAdd, AiOutlinePrinter } from "react-icons/ai";
import { db } from "@/app/utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  ToDateAndTime,
  daysInMonth,
  formatDates,
  generateStick,
  invoiceGenerate,
  updateOrderStatus,
} from "@/admin/utils/helpers";
import { updateSingleOrder } from "@/app/redux/slices/singleOrderSlice";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Tooltip } from "@mantine/core";
import { FaPrint } from "react-icons/fa";
import { useBarcode } from "next-barcode";
import { notifications } from "@mantine/notifications";
import { selectUser } from "@/app/redux/slices/authSlice";
import Link from "next/link";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { selectOrder, updateOrder } from "@/app/redux/slices/orderSlice";
import { updateBulkOrder } from "@/app/redux/slices/bulkSlice";
import { selectAllOrder, updateAllOrder } from "@/app/redux/slices/allOrder";

const SearchOrder = ({ onClick }) => {
  const [currentValue, setCurrentValue] = useState("JF010");
  const [filterOrder, setFilterOrder] = useState(null);
  const [orders, setOrders] = useState(useSelector(selectAllOrder));
  const [order, setOrder] = useState(useSelector(selectOrder));
  const [bulkOrder, setBulkOrder] = useState([]);
  const [status, setStatus] = useState([]);
  const allOrders = useSelector(selectAllOrder);
  const [opened, { open, close }] = useDisclosure(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const buttonRef = (useRef < HTMLButtonElement) | (null > null);
  const [limits, setLimits] = useState(false);
  const [limit, setLimit] = useState(30);

  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | ...
  const [courierFilter, setCourierFilter] = useState("all");

  const canFilter = ["Admin", "HR", "Sales Manager"].includes(
    useSelector(selectUser)?.staff_role
  );
  const norm = (s) =>
    String(s ?? "")
      .trim()
      .toLowerCase();

  const applyFilters = () => {
    let list = orders || [];

    if (statusFilter !== "all") {
      list = list.filter((o) => norm(o?.status) === statusFilter);
    }
    if (courierFilter !== "all") {
      list = list.filter(
        (o) => norm(o?.fulfillment?.courier) === courierFilter
      );
    }

    // ফলাফল স্টোরে দিন
    dispatch(updateOrder(list));
    dispatch(updateBulkOrder(list));
  };

  const statusChange = (e) => {
    if (!canFilter) return;
    const v = norm(e.target.value);
    setStatusFilter(v === "status" ? "all" : v);
  };

  const courierChange = (e) => {
    if (!canFilter) return;
    const v = norm(e.target.value);
    setCourierFilter(v === "courier" ? "all" : v);
  };

  // orders/status/courier বদলালেই রি-ফিল্টার
  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, courierFilter]);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrders(allOrders); // Directly set the orders
    };
    fetchOrders();
  }, [allOrders]);

  useEffect(() => {
    if (!!opened) return;
    setCurrentValue("JF010");
    setFilterOrder(null);
  }, [opened]);
  useEffect(() => {
    setOrder(orders);
  }, [orders]);
  const handleChange = (e) => {
    setCurrentValue(e.currentTarget.value);
  };
  // const buttonRef = useRef(null);        // ✅ JS
  const toggleOpen = () => (opened ? close() : open());

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus(); // Auto-focus the button when the component mounts
    }
  }, [filterOrder]);

  // Sticker
  const stickerStatus = async (item) => {
    if (item.status === "processing") {
      await updateStatus(item, "shipped");
      generateStick(item, inputRef?.current?.src);
    } else {
      toggleOpen(); // ✅ call
    }
  };

  // Invoice
  const getInvoice = async (item) => {
    if (item.status === "pending") {
      invoiceGenerate(item);
      await updateStatus(item, "processing", item?.id);
    } else {
      toggleOpen(); // ✅ call
    }
    close();
  };

  // Change Status from status Action
  const onStatusChanged = async (e, id) => {
    e.preventDefault();
    const newStatus = e.target.value;
    await updateStatus(filterOrder, newStatus);
    setFilterOrder(null);
  };

  const updateStatus = async (order, newStatus) => {
    const success = await updateOrderStatus(db, order.id, order, newStatus);
    if (success) {
      notifications.show({
        title: "Status Updated Successfully",
        message: `Order #${order.id} status changed to ${newStatus}.`,
        color: "blue",
      });
      close();
    } else {
      notifications.show({
        title: "Status Update Failed",
        message: "An error occurred while updating the status.",
        color: "red",
      });
    }
  };

  useEffect(() => {
    const value = currentValue?.toUpperCase();
    if (value?.split("0")[0] === "PR" && value.length === 10) {
      filter(value);
    }
  }, [currentValue]);

  const filter = async (id) => {
    await db
      .collection("orders")
      .doc(id)
      .get()
      .then((doc) => {
        if (!!doc.data()) {
          const singleOrder = { id: doc.id, ...doc.data() };
          dispatch(updateSingleOrder([singleOrder]));
          setFilterOrder(singleOrder);
          open();
        }
      });
  };

  useEffect(() => {
    setLimits(
      ((user.staff_role === "Admin" ||
        user.staff_role === "HR" ||
        user.staff_role === "CEO") &&
        true) ||
        false
    );
  }, []);

  useEffect(() => {
    limits ? setLimit(400) : setLimit(30);
  }, [limits]);

  // Get order from firebase database
  useEffect(() => {
    const unSub = db
      .collection("orders")
      .orderBy("created_at", "desc")
      .limit(limit)
      .onSnapshot((snap) => {
        const order = [];
        snap.docs.map((doc) => {
          order.push({
            id: doc.id,
            ...doc.data(),
            // timestamp: doc.data().timestamp?.toDate().getTime(),
          });
        });
        dispatch(updateAllOrder(order));
        dispatch(updateOrder(order));
      });
    return () => {
      unSub();
    };
  }, [limit]);

  return (
    <>
      <Modal opened={opened} onClose={close} size="xl" title="Found Data...">
        {filterOrder && (
          <div className="p-3">
            <div className="flex justify-end gap-2">
              <div
                className={`inline-block px-4 text-center ${
                  user.staff_role === "HR" ||
                  user.staff_role == "Admin" ||
                  user.staff_role === "Sales Manager"
                    ? ""
                    : "hidden"
                }`}
              >
                <select
                  className="bg-black flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer text-xs text-white font-medium hover:shadow-lg transition-all duration-300"
                  onChange={(e) => onStatusChanged(e)}
                >
                  <option
                    value={filterOrder.status}
                    className="capitalize"
                    hidden
                  >
                    {filterOrder.status}
                  </option>

                  <option value="pending">Pending</option>
                  {user.staff_role !== "Sales Manager" && (
                    <option value="processing">Processing</option>
                  )}
                  {user.staff_role !== "Sales Manager" && (
                    <option value="shipped">Shipped</option>
                  )}
                  {user.staff_role !== "Sales Manager" && (
                    <option value="delivered">Delivered</option>
                  )}

                  <option value="hold">Hold</option>
                  {user.staff_role !== "Sales Manager" && (
                    <option value="returned">Returned</option>
                  )}

                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {((filterOrder.status === "pending" &&
                user.staff_role === "Sales Executive") ||
                user.staff_role === "HR" ||
                user?.staff_role === "Sales Manager" ||
                user?.staff_role === "Admin") && (
                <Link href={`/place-order/edit-order/id=${filterOrder.id}`}>
                  <span className="bg-black flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer  text-xs text-white font-medium hover:shadow-lg transition-all duration-300">
                    <FiEdit size={14} /> Edit
                  </span>
                </Link>
              )}
              <Link href={`/orders/invoice/id=${filterOrder.id}`}>
                <span className="bg-black flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer  text-xs text-white font-medium hover:shadow-lg transition-all duration-300">
                  <HiOutlineDocumentDownload size={18} /> Invoice
                </span>
              </Link>
            </div>
            <div>
              <h1 className="text-center text-2xl font-semibold pb-1">
                ID #{filterOrder?.orderID} ({filterOrder?.status})
              </h1>
              <h1 className="text-center text-2xl font-semibold border-b pb-3">
                SFC #{filterOrder?.fulfillment?.consignment_id}
              </h1>
            </div>

            <div className="pt-3 flex justify-between w-full">
              <div className="w-7/12">
                <h2 className="text-lg font-semibold">
                  {filterOrder?.customer.name}
                </h2>
                <h2>Address: {filterOrder?.shipping_address.street}</h2>
                <h2>Phone Numbaer: {filterOrder?.customer.phone}</h2>
                <h2 className="text-slate-600">
                  Note: {filterOrder?.notes || "N/A"}
                </h2>
              </div>
              <div className="w-4/12 text-end">
                <h3>{formatDates(filterOrder?.created_at)}</h3>
                <h3>Order type: {filterOrder?.meta?.source || "N/A"}</h3>
                <h3>Received by: {filterOrder?.received_user || "N/A"}</h3>
                <h3>
                  Entry by:{" "}
                  {filterOrder?.created_user || filterOrder.created_user}
                </h3>
                {filterOrder?.updated_user && (
                  <h3>Updated by: {filterOrder?.updated_user || "N/A"}</h3>
                )}

                <h3>QTY: {filterOrder.quantity}</h3>
              </div>
            </div>
            <h1 className="text-2xl">Order:</h1>
            <div className="border-t my-2">
              {filterOrder &&
                filterOrder.items.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between py-1 md:py-1 border-b">
                      <div>
                        <h2
                          className="text-sm sm:text-xl text-title font-mono"
                          id={`item_0${++i}`}
                        >
                          {item?.title}
                        </h2>
                      </div>
                      <div className="flex justify-between w-7/12">
                        <span
                          className="text-sm sm:text-xl text-title font-mono"
                          id={`item_0${i}_quantity`}
                        >
                          {item?.quantity}
                          {item?.unit}
                        </span>
                        <span
                          className="text-sm sm:text-xl text-title font-mono"
                          id={`item_0${i}_price`}
                        >
                          {item.price}
                        </span>
                        <span
                          className="text-sm sm:text-xl text-title font-mono"
                          id={`item_0${i}_total_price`}
                        >
                          {item?.line_total}/-
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-between mb-10 gap-5">
              <div className=" ">
                <h2 className="text-slate-600 ">
                  [Note: {filterOrder?.notes || "N/A"}]
                </h2>
              </div>
              <div className="text-sm flex ">
                <div className="text-sm sm:text-xl text-title font-semibold">
                  <h2>Sub-Total</h2>
                  <h2>Delivery</h2>
                  <h2>Discount</h2>
                  <h2>Total</h2>
                </div>
                <div className="text-sm sm:text-xl text-title font-semibold px-4">
                  <h2>:</h2>
                  <h2>:</h2>
                  <h2>:</h2>
                  <h2>:</h2>
                </div>
                <div className="text-sm sm:text-xl text-title font-semibold text-right">
                  <h2>{filterOrder?.totals?.items}/-</h2>
                  <h2>{filterOrder?.totals?.shipping}/-</h2>
                  <h2>-{filterOrder?.totals?.discount}/-</h2>
                  <h2>{filterOrder?.totals?.grand}/-</h2>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              {user.staff_role === "HR" &&
                filterOrder.status === "processing" && (
                  <Tooltip label="Sticker" color="green" withArrow>
                    <button
                      title="Sticker"
                      className="bg-green-400 flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer hover:bg-green-500 text-sm text-white font-medium hover:shadow-lg transition-all duration-300"
                      onClick={() => stickerStatus(filterOrder)}
                    >
                      <FaPrint size={14} /> Sticker
                    </button>
                  </Tooltip>
                )}
              {(user.staff_role === "HR" || user.staff_role === "Admin") &&
                filterOrder.status === "pending" && (
                  <Tooltip label="Invoice" color="blue" withArrow>
                    <button
                      ref={buttonRef}
                      autoFocus
                      title="Invoice"
                      className="bg-blue-400 flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-500 text-sm text-white font-medium hover:shadow-lg transition-all duration-300"
                      onClick={() => getInvoice(filterOrder)}
                    >
                      <AiOutlinePrinter size={18} /> Invoice
                    </button>
                  </Tooltip>
                )}
            </div>
          </div>
        )}
      </Modal>
      <div className="min-w-0 rounded-lg overflow-hidden bg-gray-50  shadow-xs  mb-5">
        <div className="p-4">
          <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <div className="flex-grow-0  md:flex-grow lg:flex-grow xl:flex-grow">
                <input
                  className="block w-full px-3 py-1 text-sm focus:outline-neutral-200 leading-5 rounded-md  border-gray-200 h-14 bg-gray-100 border-transparent focus:bg-white"
                  type="text"
                  value={currentValue}
                  onChange={(e) => handleChange(e)}
                  placeholder="Search by #ID"
                />
              </div>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-2 py-1 text-sm focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 focus:shadow-none leading-5 border h-14 bg-gray-100 border-transparent focus:bg-gray-50"
                onChange={statusChange}
                value={statusFilter === "all" ? "status" : statusFilter}
                disabled={!canFilter}
              >
                <option value="status">Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="hold">Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-2 py-1 text-sm focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 focus:shadow-none leading-5 border h-14 bg-gray-100 border-transparent focus:bg-gray-50"
                onChange={courierChange}
                value={courierFilter === "all" ? "courier" : courierFilter}
                disabled={!canFilter}
              >
                <option value="courier">Courier</option>
                <option value="pathao">Pathao</option>
                <option value="steadfast">Steadfast</option>
              </select>
            </div>
            <div className="w-full md:w-56 lg:w-56 xl:w-56">
              <Button
                onClick={onClick}
                title="Place Order"
                className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg transition-all duration-300 text-white w-full h-14"
                icon=<AiOutlineAppstoreAdd size={24} />
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOrder;
