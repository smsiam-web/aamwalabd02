import React, { useEffect, useState } from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useDisclosure } from "@mantine/hooks";
import { Modal, NumberInput } from "@mantine/core";
import Button from "./Button";
import { TodayDate } from "../../utils/helpers";
import { db } from "@/app/utils/firebase";
import { notifications } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { selectUser } from "@/app/redux/slices/authSlice";
import { IoPrintOutline } from "react-icons/io5";
import { IoMdCloudDownload } from "react-icons/io";

const ExportCSV = () => {
  const [access, setAccess] = useState(true);
  const [value, setValue] = useState();
  const user = useSelector(selectUser);

  const [opened, { open, close }] = useDisclosure(false);
  const DEFAULT_FILENAME = TodayDate();

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  useEffect(() => {
    user?.staff_role === "HR" || user?.staff_role === "Admin"
      ? setAccess(false)
      : setAccess(true);
  }, [user]);

  const exportToCSV = async () => {
    if (access) return;
    if (!!value) {
      db.collection("placeOrder")
        .orderBy("timestamp", "desc")
        .limit(value)
        .get()
        .then((snap) => {
          const order = [];
          snap.forEach((doc) => {
            // doc.data() is the data of the document
            order.push({
              Invoice: doc.id,
              Name: doc?.data()?.customer_details.customer_name,
              Address: doc?.data()?.customer_details.customer_address,
              Phone: doc?.data()?.customer_details.phone_number,
              Amount: doc?.data()?.customer_details.salePrice,
              Weight:
                doc?.data()?.status === "Cancelled" ? 0 : doc?.data()?.weight,
              Created: doc?.data()?.date,
              Status: doc?.data()?.status,
              Ad_ID: doc?.data()?.customer_details.ad_ID || "null",
              order_from: doc?.data()?.customer_details.order_from || "null",
              received_by: doc?.data()?.customer_details.received_by || "null",
              Placed_By: doc?.data()?.placeBy?.user || doc?.data()?.placeBy,
              Note: doc?.data()?.customer_details.note,
            });
          });
          if (!!order.length) {
            const ws = XLSX.utils.json_to_sheet(order.reverse());
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, {
              bookType: "xlsx",
              type: "array",
            });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, DEFAULT_FILENAME + fileExtension);
            notifications.show({
              title: "Successful",
              message: `Download Successfully😊 Total Data: ${value}`,
              color: "Blue",
            });
            close();
            setValue(1);
          } else {
            notifications.show({
              title: "Not Found!!",
              message: `(•_•)There was no data for download... !!`,
              color: "red",
            });
            setValue(0);
          }
        });
    }
    setAccess(true);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Order List">
        <div className="col-span-2 gap-4 md:col-span-2 xl:col-span-1 min-w-full">
          <NumberInput
            withAsterisk
            data-autofocus
            label="From last"
            placeholder="Number of order"
            // onChange={(e) => upValue(e)}
            value={value}
            onChange={setValue}
          />

          <div className="mt-6">
            <Button
              onClick={(e) => exportToCSV()}
              title="Download XLSX"
              icon=<IoMdCloudDownload size={24} />
              className={`bg-blue-400  hover:shadow-lg transition-all duration-300 text-white w-full h-14 ${
                !value && "cursor-auto"
              } ${!!value && "hover:bg-blue-500"}`}
            />
          </div>
        </div>
      </Modal>

      <Button
        disabled={access}
        onClick={open}
        title="Download"
        className={`bg-blue-400 ${
          !access && "hover:bg-blue-500 hover:shadow-lg "
        } transition-all duration-300 text-white w-full h-14`}
      />
    </>
  );
};

export default ExportCSV;
