import React, { useEffect, useState } from "react";
import { Tabs } from "@mantine/core";
import {
  AppTextArea,
  FormDropdown,
  FormInput,
  FormRadio,
} from "../../shared/Form";
import { db } from "@/app/utils/firebase";
import { useSelector } from "react-redux";
import { selectSingleCustomer } from "@/app/redux/slices/singleCustomerSlice";
import { selectWeightDetails } from "@/app/redux/slices/tempWeightDetails";
import { selectUser } from "@/app/redux/slices/authSlice";
import FormDropdownJF from "./FormDropdownJF";

const OrderDetailsFormJF = ({ singleOrder, rest }) => {
  const [lungi, setLungi] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [weightDetails, setweightDetails] = useState(null);
  const [courier, setCourier] = useState("pathao");

  //pathao city, zone, Area
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  const user = useSelector(selectUser);

  const getCustomer = useSelector(selectSingleCustomer);
  const getWeightDetails = useSelector(selectWeightDetails);
  useEffect(() => {
    setCustomer(getCustomer);
    setweightDetails(getWeightDetails);
  }, [getCustomer, getWeightDetails]);

  // Get products from firebase database
  useEffect(() => {
    const unSub = db
      .collection("products")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const lungi = [];
        snap.docs.map((doc) => {
          doc.data().product_details?.parent_category === "Jannat Fashon" && doc.data()?.product_details?.child_category == "Lungi" &&
            lungi.push({
              ...doc.data().product_details,
            });
        });
        setLungi(lungi);
      });

    return () => {
      unSub();
    };
  }, []);
  const StuffList = [
    {
      name: "MD Sabbir",
      id: "MD Sabbir",
    },
    {
      name: "Rakibul Islam",
      id: "Rakibul Islam",
    },

    {
      name: "Md Mahim",
      id: "Md Mahim",
    },

    {
      name: "Md. Rimon",
      id: "Md. Rimon",
    },
    {
      name: "Ajoy Shil",
      id: "Ajoy Shil",
    },

    {
      name: "Siam Chowdhury",
      id: "Siam Chowdhury",
    },
    {
      name: "Admin",
      id: "Admin",
    },
  ];
  const OrderFrom = [
    {
      name: "Messenger Order",
      id: "Messenger Order",
    },
    {
      name: "Phone Call Order",
      id: "Phone Call Order",
    },
    {
      name: "WhatsApp Order",
      id: "WhatsApp Order",
    },
    {
      name: "Website Order",
      id: "Website Order",
    },
    {
      name: "Tele Sales",
      id: "Tele Sales",
    },
    {
      name: "Paikari Order",
      id: "Paikari Order",
    },
  ];
  const MarkAs = [
    {
      name: "Normal",
      id: "Normal",
    },
    {
      name: "Argent",
      id: "Argent",
    },
  ];
  const AdID = [
    {
      name: "W03",
      id: "W03",
    },
    {
      name: "W02",
      id: "W02",
    },
    {
      name: "W01",
      id: "W01",
    },
    {
      name: "8",
      id: "8",
    },
    {
      name: "7",
      id: "7",
    },
    {
      name: "6",
      id: "6",
    },
    {
      name: "5",
      id: "5",
    },
    {
      name: "4",
      id: "4",
    },
    {
      name: "3",
      id: "3",
    },

    {
      name: "2",
      id: "2",
    },
    {
      name: "1",
      id: "1",
    },
  ];
  const Courier = [
    {
      name: "Pathao",
      id: "Pathao",
    },
    {
      name: "SteadFast",
      id: "SteadFast",
    },
  ];

  const obj = singleOrder?.order;


  return (
    <div className="max-h-full">
      <div className="pb-2">
        <span>Delivery Type:</span>
        <FormRadio
          type="text"
          name="delivery_type"
          forTrue="Home"
          forFalse="Point"
        />
      </div>
      <div>
        <span>
          Phone Number<span className="text-red-600">*</span>
        </span>
        <FormInput
          type="text"
          max={11}
          name="phone_number"
          placeholder="+880"
        />
      </div>
      <div>
        <span>
          Name<span className="text-red-600">*</span>
        </span>
        <FormInput name="customer_name" placeholder="Name" />
      </div>
      <div>
        <span>
          Address<span className="text-red-600">*</span>
        </span>
        <span className="text-sub-title text-sm block">
          (maximum 300 characters)
        </span>
        <AppTextArea
          name="customer_address"
          placeholder="Ex: H#12, R#04, Sec# 4, Mirpur Dhaka."
        />
      </div>

      <div className="pb-3">
        {!!obj?.length && <span className="md:text-2xl">Order</span>}
        {!!obj?.length &&
          obj.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between py-1 border-b sm:border-b-2">
                <div>
                  <h2
                    className="text-md md:text-xl text-slate-500 font-mono"
                    id={`item_0${++i}`}
                  >
                    {item.title}
                  </h2>
                </div>
                <div className="flex justify-between w-7/12">
                  <span
                    className="text-md md:text-xl text-slate-500 font-mono"
                    id={`item_0${i}_quantity`}
                  >
                    {item.quantity}
                  </span>
                  <span
                    className="text-md md:text-xl text-slate-500 font-mono"
                    id={`item_0${i}_price`}
                  >
                    {item.price}
                  </span>
                  <span
                    className="text-md md:text-xl text-slate-500 font-mono"
                    id={`item_0${i}_total_price`}
                  >
                    {item.total_price}/-
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div>
        <Tabs
          color="violet"
          defaultValue="Lungi"
          variant="pills"
        >
          <Tabs.List>
            <Tabs.Tab value="Lungi">
              Lungi
            </Tabs.Tab>
            <Tabs.Tab value="others">
              Others
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Lungi" pt="xs">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {lungi?.map((i) => (
                <div
                  key={i.yup}
                  className="p-2 bg-blue-500 rounded-md col-span-1"
                >
                  <span className="pb-10 text-base text-white">
                    #{i.product_name}
                  </span>
                  <div className="flex items-center pt-1 sm:pt-2">
                    <div className="w-2/3">
                      <FormInput
                        className=""
                        type="number"
                        name={i.yup}
                        id="lungi"
                        item={i}
                        placeholder=""
                      />
                    </div>
                    <span className="text-white pl-2 text-lg">

                    {i.unit}
                    </span>
                  </div>
                  <div className="bg-slate-100 p-1 text-xs rounded-lg flex  justify-around">
                    <div className="text-xs py-1">
                      
                      <h2 className="text-sm bg-green-200 font-semibold text-green-700 px-2 rounded-full">
                        Sale: {i.sale_price}tk
                      </h2>
                    </div>                                      
                  </div>
                </div>
              ))}
              {lungi?.length === 0 && (
                <h1 className="text-lg text-slate-300 text-center col-span-2">
                  Product Not Found...!!!
                </h1>
              )}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="others" pt="xs">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3"></div>
          </Tabs.Panel>
        </Tabs>
      </div>
      <div className="mt-3">
        <span>
          Price<span className="text-red-600">*</span>
        </span>
        <FormInput type="number" name="salePrice" placeholder="Price" />
      </div>
      <div className="mt-3">
        <span>Courier Partner</span>
        <FormDropdown name="courier" placeholder="Courier" items={Courier} />
      </div>
      {/* <div className="mt-3">
        <span>City</span>
        <FormDropdownJF
          itemsTrigger="cities"
          selected="setSelectedCity"
          keys="city_id"
          label="city_name"
          name="recipient_city"
          placeholder="Cities"
          setSelectedCity={setSelectedCity}
        />
      </div>

      <div className="mt-3">
        <span>Zone</span>
        <FormDropdownJF
          itemsTrigger="zones"
          selected="setSelectedZone"
          selectedCity={selectedCity}
          keys="zone_id"
          label="zone_name"
          name="recipient_zone"
          placeholder="Zones"
          setSelectedZone={setSelectedZone}
        />
      </div>

      <div className="mt-3">
        <span>Area</span>
        <FormDropdownJF
          itemsTrigger="areas"
          selectedZone={selectedZone}
          keys="area_id"
          label="area_name"
          name="recipient_area"
          placeholder="Areas"
        />
      </div> */}
      <div className="mt-3">
        <span>
          Received by<span className="text-red-600">*</span>
        </span>
        {(!singleOrder && user?.staff_role === "Sales Executive") ||
        user?.staff_role === "HR" ||
        user?.staff_role === "Admin" ||
        user?.staff_role === "Sales Manager" ? (
          <FormDropdown
            disabled
            name="received_by"
            placeholder="Order received by"
            items={StuffList}
          />
        ) : (
          <span className="block border px-3 py-3 rounded-md text-slate-500">
            {singleOrder?.customer_details?.received_by || "Null"}
          </span>
        )}
      </div>
      <div className="mt-3">
        <span>Ad ID</span>
        <FormDropdown name="ad_ID" placeholder="Ad ID" items={AdID} />
      </div>
      <div className="mt-3">
        <span>Order From</span>
        <FormDropdown
          name="order_from"
          // placeholder="Messenger Order"
          items={OrderFrom}
        />
      </div>
      <div className="mt-3">
        <span>Mark As</span>
        <FormDropdown name="markAs" items={MarkAs} />
      </div>
      <div>
        <span>Invoice Note:</span>
        <span className="text-sub-title text-sm block">
          (maximum 400 characters)
        </span>
        <AppTextArea name="invoice_Note" placeholder="Invoice note..." />
      </div>
      <div>
        <span>Courier Note:</span>
        <span className="text-sub-title text-sm block">
          (maximum 400 characters)
        </span>
        <AppTextArea name="note" placeholder="Courier note..." />
      </div>
    </div>
  );
};

export default OrderDetailsFormJF;
