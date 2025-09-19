import React, { useEffect, useMemo, useRef, useState } from "react";
import { FieldArray, useFormikContext, getIn } from "formik";
import { AppTextArea, FormDropdown, FormInput } from "../../shared/Form";
import ProductSearchAddWithCreate from "./ProductSearchAdd";
import { db } from "@/app/utils/firebase";

/**
 * Order Details Form (Formik child component)
 * JavaScript version (.js)
 */

// --- Select options ---
const ORDER_STATUS = [
  { name: "Pending", id: "pending" },
  { name: "Processing", id: "processing" },
  { name: "Shipped", id: "shipped" },
  { name: "Delivered", id: "delivered" },
  { name: "Paid", id: "paid" },
  { name: "Fulfilled", id: "fulfilled" },
  { name: "Cancelled", id: "cancelled" },
  { name: "Refunded", id: "refunded" },
  { name: "Partially Refunded", id: "partially_refunded" },
];

const PAYMENT_METHODS = [
  { name: "Cash on Delivery (COD)", id: "cod" },
  { name: "Bkash", id: "bkash" },
  { name: "Nagad", id: "nagad" },
  { name: "Rocket", id: "rocket" },
];

const PAYMENT_STATUS = [
  { name: "Unpaid", id: "unpaid" },
  { name: "Authorized", id: "authorized" },
  { name: "Paid", id: "paid" },
  { name: "Refunded", id: "refunded" },
  { name: "Partial", id: "partial" },
];

const FULFILLMENT_STATUS = [
  { name: "Unfulfilled", id: "unfulfilled" },
  { name: "Partial", id: "partial" },
  { name: "Fulfilled", id: "fulfilled" },
];

const YES_NO = [
  { name: "Yes", id: true },
  { name: "No", id: false },
];

const CURRENCY = [{ name: "BDT", id: "BDT" }];

const COURIER = [
  {
    name: "Pathao",
    id: "Pathao",
  },
  {
    name: "SteadFast",
    id: "SteadFast",
  },
];

// --- Helpers ---
function toNumber(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function useTotalsAutoCompute() {
  const { values, setFieldValue } = useFormikContext();
  console.log(values);

  const itemsSum = useMemo(() => {
    const items = getIn(values, "items") || [];
    return items.reduce((sum, it) => {
      const price = toNumber(it?.price, 0);
      const qty = toNumber(it?.quantity, 0);
      const line = toNumber(it?.line_total, price * qty);
      return sum + line;
    }, 0);
  }, [values]);

  useEffect(() => {
    const discount = toNumber(getIn(values, "totals.discount"), 0);
    const shipping = toNumber(getIn(values, "totals.shipping"), 0);
    const tax = toNumber(getIn(values, "totals.tax"), 0);

    const grand = +(itemsSum - discount + shipping + tax).toFixed(2);

    setFieldValue("totals.items", +itemsSum.toFixed(2), false);
    setFieldValue("totals.grand", grand, false);
  }, [itemsSum, values, setFieldValue]);
}
const Line = ({ h = "h-4", w = "w-full" }) => (
  <div className={`rounded bg-gray-200 ${h} ${w}`}></div>
);

const SectionSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <Line h="h-4" w="w-32" />
    <div className="grid grid-cols-2 gap-3">
      <Line />
      <Line />
      <Line />
      <Line />
    </div>
  </div>
);

// function useCustomerAutofill() {
//   const { values, setFieldValue } = useFormikContext();
//   const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

//   // কেবল ফোন ডিজিটস ট্র্যাক করুন
//   const phoneDigits = String(getIn(values, "customer.phone") ?? "").replace(
//     /\D/g,
//     ""
//   );

//   const timerRef = useRef(null);
//   const lastFetchedRef = useRef(null); // শেষ যেটা ফেচ হয়েছে
//   const aliveRef = useRef(true); // cleanup guard

//   useEffect(() => {
//     aliveRef.current = true;
//     return () => {
//       aliveRef.current = false;
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     // বৈধ না হলে কিছুই করবেন না
//     if (phoneDigits.length !== 11 || !/^01/.test(phoneDigits)) return;

//     // আগেরটার সাথে মিললে আবার ফেচ নয়
//     if (lastFetchedRef.current === phoneDigits) return;

//     // ডিবাউন্স
//     if (timerRef.current) clearTimeout(timerRef.current);
//     timerRef.current = setTimeout(async () => {
//       try {
//         setIsLoadingCustomer(true);

//         const snap = await db.collection("customers").doc(phoneDigits).get();

//         // এই সময়ের মধ্যে ফোন পরিবর্তন হলে ইগনোর
//         if (!aliveRef.current || lastFetchedRef.current === phoneDigits) return;

//         lastFetchedRef.current = phoneDigits;

//         const setIfDiff = (path, val) => {
//           const cur = getIn(values, path);
//           if (cur !== val) setFieldValue(path, val, false);
//         };

//         if (!snap.exists) {
//           // ডাটা না থাকলে ফিল্ড ক্লিয়ার; টাইপ করা ফোন রেখে দিন
//           setIfDiff("customer.phone", phoneDigits);
//           setIfDiff("customer.name", "");
//           setIfDiff("shipping_address.city", "");
//           setIfDiff("shipping_address.state", "");
//           setIfDiff("shipping_address.country", "");
//           setIfDiff("shipping_address.street", "");
//           return;
//         }

//         const data = snap.data();

//         setIfDiff("customer.phone", data?.customer?.phone ?? phoneDigits);
//         setIfDiff("customer.name", data?.customer?.name ?? "");
//         setIfDiff("shipping_address.city", data?.shipping_address?.city ?? "");
//         setIfDiff(
//           "shipping_address.state",
//           data?.shipping_address?.state ?? ""
//         );
//         setIfDiff(
//           "shipping_address.country",
//           data?.shipping_address?.country ?? ""
//         );
//         setIfDiff(
//           "shipping_address.street",
//           data?.shipping_address?.street ?? ""
//         );
//       } catch (err) {
//         console.error("Failed to load customer:", err);
//       } finally {
//         if (aliveRef.current) setIsLoadingCustomer(false);
//       }
//     }, 300);

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//     // ✅ কেবল phoneDigits বদলালে চলবে
//   }, [phoneDigits, setFieldValue, values]);

//   return { isLoadingCustomer };
// }
// map createCustomer -> unified fields
function mapCreateCustomer(src = {}) {
  return {
    name: src.cus_name || "",
    phone: src.cus_contact || "",
    street: src.cus_address || "",
    city: src.city || "",
    state: src.state || "",
    country: src.country || "",
  };
}

function digitsOnly(v) {
  return String(v ?? "").replace(/\D/g, "");
}

function useCustomerAutofill() {
  const { values, setFieldValue } = useFormikContext();
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  // কেবল ডিজিটস ট্র্যাক করুন
  const phoneDigits = digitsOnly(getIn(values, "customer.phone"));

  const timerRef = useRef(null);
  const lastFetchedRef = useRef(null);
  const aliveRef = useRef(true);
  const currentPhoneRef = useRef(phoneDigits);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // সর্বশেষ টাইপ করা ফোন ধরে রাখি
  useEffect(() => {
    currentPhoneRef.current = phoneDigits;
  }, [phoneDigits]);

  useEffect(() => {
    // validate (১১ ডিজিট + 01 দিয়ে শুরু)
    if (phoneDigits.length !== 11 || !/^01/.test(phoneDigits)) return;

    // একই নাম্বার বারবার ফেচ নয়
    if (lastFetchedRef.current === phoneDigits) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const requested = phoneDigits; // এই রিকোয়েস্টের টার্গেট
      setIsLoadingCustomer(true);

      const setIfDiff = (path, val) => {
        const cur = getIn(values, path);
        if (cur !== val) setFieldValue(path, val, false);
      };

      try {
        // 1) customers/{phone}
        let snap = await db.collection("customers").doc(requested).get();
        let payload = null; // unified shape

        if (snap.exists) {
          const d = snap.data() || {};
          payload = {
            name: d?.customer?.name || "",
            phone: d?.customer?.phone || requested,
            street: d?.shipping_address?.street || "",
            city: d?.shipping_address?.city || "",
            state: d?.shipping_address?.state || "",
            country: d?.shipping_address?.country || "",
          };
        } else {
          // 2) createCustomer/{phone}
          const cDoc = await db
            .collection("createCustomer")
            .doc(requested)
            .get();

          if (cDoc.exists) {
            payload = mapCreateCustomer(cDoc.data());
          } else {
            // 3) createCustomer where cus_contact == phone
            const q = await db
              .collection("createCustomer")
              .where("cus_contact", "==", requested)
              .limit(1)
              .get();

            if (!q.empty) {
              payload = mapCreateCustomer(q.docs[0].data());
            }
          }
        }

        // ইউজার নাম্বার পাল্টে ফেললে ইগনোর
        if (!aliveRef.current || currentPhoneRef.current !== requested) {
          return;
        }

        lastFetchedRef.current = requested;

        if (!payload) {
          // ডেটা না পেলে ফিল্ড ক্লিয়ার (টাইপ করা ফোন রেখে দিন)
          setIfDiff("customer.phone", requested);
          setIfDiff("customer.name", "");
          setIfDiff("shipping_address.street", "");
          setIfDiff("shipping_address.city", "");
          setIfDiff("shipping_address.state", "");
          setIfDiff("shipping_address.country", "");
          return;
        }

        // ফর্ম ফিল্ড সেট
        setIfDiff("customer.phone", payload.phone || requested);
        setIfDiff("customer.name", payload.name || "");
        setIfDiff("shipping_address.street", payload.street || "");
        setIfDiff("shipping_address.city", payload.city || "");
        setIfDiff("shipping_address.state", payload.state || "");
        setIfDiff("shipping_address.country", payload.country || "");
      } catch (err) {
        console.error("Failed to load customer:", err);
      } finally {
        if (aliveRef.current) setIsLoadingCustomer(false);
      }
    }, 300); // debounce

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phoneDigits, setFieldValue, values]);

  return { isLoadingCustomer };
}

function useLineTotalsAutoCompute(index) {
  const { values, setFieldValue } = useFormikContext();
  const price = toNumber(getIn(values, `items[${index}].price`), 0);
  const qty = toNumber(getIn(values, `items[${index}].quantity`), 0);

  useEffect(() => {
    const lt = +(price * qty).toFixed(2);
    setFieldValue(`items[${index}].line_total`, lt, false);
  }, [price, qty, index, setFieldValue]);
}

function SectionTitle({ children }) {
  return <div className="font-medium text-base">{children}</div>;
}

function Subtle({ children }) {
  return <span className="text-xs text-gray-500">{children}</span>;
}

// --- Main Form ---
const OrderDetailsFormUp = () => {
  const { values } = useFormikContext();

  // keep totals consistent with items, discount, shipping, tax
  useTotalsAutoCompute();

  // 🔹 our new hook: gives us loading flag while fetching customer doc
  const { isLoadingCustomer } = useCustomerAutofill();

  return (
    <div className="max-h-full space-y-4">
      {/* BASICS */}
      <div className="grid grid-cols-2 gap-3 p-3 border rounded">
        <SectionTitle>Order Basics</SectionTitle>
        <div className="col-span-2 grid grid-cols-2 gap-3">
          <div>
            <span>Status</span>
            <FormDropdown
              name="status"
              placeholder="Select"
              items={ORDER_STATUS}
            />
          </div>
          <div>
            <span>Currency</span>
            <FormDropdown
              name="currency"
              placeholder="Currency"
              items={CURRENCY}
            />
          </div>
        </div>
      </div>
      {/* CUSTOMER (with overlay) */}
      <div className="relative p-3 border rounded space-y-3">
        <SectionTitle>Customer</SectionTitle>

        {/* Overlay while loading */}
        {isLoadingCustomer && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="w-full px-2">
              <SectionSkeleton />
            </div>
          </div>
        )}

        {/* Fields (still rendered; overlay blocks interaction) */}
        <div
          className={`grid grid-cols-2 gap-3 ${
            isLoadingCustomer
              ? "pointer-events-none select-none opacity-60"
              : ""
          }`}
        >
          <div className="col-span-2 sm:col-span-1">
            <span>Phone</span>
            <FormInput name="customer.phone" placeholder="01XXXXXXXXX" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span>Name</span>
            <FormInput name="customer.name" placeholder="Mr. Customer" />
          </div>
          {/* <div className="col-span-2 sm:col-span-1">
            <span>Marketing Opt-in</span>
            <FormDropdown
              name="customer.marketing_opt_in"
              items={YES_NO}
              placeholder="No"
            />
          </div> */}
        </div>
      </div>
      {/* ADDRESSES (with overlay) */}
      <div className="relative p-3 border rounded space-y-3">
        <SectionTitle>Shipping Address</SectionTitle>

        {isLoadingCustomer && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="w-full px-2">
              <SectionSkeleton />
            </div>
          </div>
        )}

        <div
          className={`${
            isLoadingCustomer
              ? "pointer-events-none select-none opacity-60"
              : ""
          }`}
        >
          <AddressFields prefix="shipping_address" />
        </div>
      </div>

      {/* ITEMS */}
      <div className="space-y-3 p-3 border rounded">
        <SectionTitle>Items</SectionTitle>
        <div className="col-span-6">
          <ProductSearchAddWithCreate />
        </div>
        <FieldArray
          name="items"
          render={({ remove }) => {
            const items = getIn(values, "items") || [];
            const idxs = items.map((_, i) => i).reverse(); // [n-1, n-2, ... , 0]
            return (
              <div className="space-y-3">
                {idxs.map((idx) => (
                  <ItemRow key={idx} index={idx} onRemove={() => remove(idx)} />
                ))}
              </div>
            );
          }}
        />
      </div>

      {/* DISCOUNTS & TOTALS */}
      <div className="grid grid-cols-2 gap-3 p-3 border rounded">
        <div className="space-y-2">
          <SectionTitle>Discounts</SectionTitle>
          <FieldArray
            name="discounts"
            render={({ push, remove }) => (
              <div className="space-y-2">
                {(getIn(values, "discounts") || []).map((_, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-2 items-end">
                    <div className="col-span-3">
                      <span>Code</span>
                      <FormInput
                        name={`discounts[${idx}].code`}
                        placeholder="WELCOME10"
                      />
                    </div>
                    <div className="col-span-2">
                      <span>Amount</span>
                      <FormInput
                        type="number"
                        name={`discounts[${idx}].amount`}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-5">
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="text-sm text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-sm underline"
                  onClick={() => push({ code: "", amount: 0 })}
                >
                  + Add discount
                </button>
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <SectionTitle>Totals</SectionTitle>
          <div>
            <span>Items Subtotal</span>
            <FormInput name="totals.items" type="number" readOnly />
            <Subtle>Auto-calculated from line totals</Subtle>
          </div>
          <div>
            <span>Discount</span>
            <FormInput
              name="totals.discount"
              type="number"
              placeholder="0.00"
            />
          </div>
          <div>
            <span>Shipping</span>
            <FormInput
              name="totals.shipping"
              type="number"
              placeholder="0.00"
            />
          </div>
          <div>
            <span>Tax</span>
            <FormInput name="totals.tax" type="number" placeholder="0.00" />
          </div>
          <div>
            <span>Grand Total</span>
            <FormInput name="totals.grand" type="number" readOnly />
            <Subtle>items - discount + shipping + tax</Subtle>
          </div>
        </div>
      </div>

      {/* PAYMENT & FULFILLMENT */}
      <div className="grid grid-cols-2 gap-3 p-3 border rounded">
        <div className="space-y-3">
          <SectionTitle>Payment</SectionTitle>
          <div>
            <span>Method</span>
            <FormDropdown
              name="payment.method"
              placeholder="Select"
              items={PAYMENT_METHODS}
            />
          </div>
          <div>
            <span>Status</span>
            <FormDropdown
              name="payment.status"
              placeholder="Select"
              items={PAYMENT_STATUS}
            />
          </div>
          <div>
            <span>Transaction ID</span>
            <FormInput
              name="payment.transaction_id"
              placeholder="(if available)"
            />
          </div>
        </div>

        <div className="space-y-3">
          <SectionTitle>Fulfillment</SectionTitle>
          <div>
            <span>Status</span>
            <FormDropdown
              name="fulfillment.status"
              placeholder="Select"
              items={FULFILLMENT_STATUS}
            />
          </div>

          <div>
            <span>Courier</span>
            <FormDropdown
              name="fulfillment.courier"
              placeholder="Select"
              items={COURIER}
              defaultValue={"Pathao"}
            />
          </div>

          <div>
            <span>Tracking Numbers</span>
            <FieldArray
              name="fulfillment.tracking_numbers"
              render={({ push, remove }) => (
                <div className="space-y-2">
                  {(getIn(values, "fulfillment.tracking_numbers") || []).map(
                    (_, idx) => (
                      <div key={idx} className="flex gap-2">
                        <FormInput
                          name={`fulfillment.tracking_numbers[${idx}]`}
                          placeholder="TRK..."
                        />
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="text-sm text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    className="text-sm text-green-600"
                    onClick={() => push("")}
                  >
                    + Add tracking
                  </button>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* META & NOTES */}
      <div className="p-3 border rounded space-y-3">
        <SectionTitle>Meta & Notes</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span>Source</span>
            <FormInput name="meta.source" placeholder="web / app / pos" />
          </div>
          <div>
            <span>Notes</span>
            <AppTextArea name="notes" placeholder="Internal notes" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents ---
const AddressFields = ({ prefix }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="col-span-1">
        <span>Street</span>
        <AppTextArea name={`${prefix}.street`} placeholder="Street, house" />
      </div>
      <div className="col-span-1">
        <span>City</span>
        <FormInput name={`${prefix}.city`} placeholder="City" />
      </div>
      <div className="col-span-1">
        <span>State / District</span>
        <FormInput name={`${prefix}.state`} placeholder="Dhaka" />
      </div>
      {/* <div className="col-span-1">
        <span>Country</span>
        <FormInput
          name={`${prefix}.country`}
          value="BD"
          disabled
          placeholder=""
        />
      </div> */}
    </div>
  );
};

const ItemRow = ({ index, onRemove }) => {
  useLineTotalsAutoCompute(index);
  const { values } = useFormikContext();

  return (
    <div className="grid grid-cols-6 gap-3 p-3 border rounded">
      <div className="col-span-6 flex items-center justify-between">
        <div className="font-medium">Item {index + 1}</div>
        <button
          type="button"
          className="text-sm text-red-500"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>

      <div className="col-span-3 sm:col-span-2 gap-2">
        <span>Product ID</span>
        <FormInput name={`items[${index}].product_id`} placeholder="1001" />
      </div>
      <div className="col-span-3 sm:col-span-2 gap-2">
        <span>Title</span>
        <FormInput name={`items[${index}].title`} placeholder="Basic Tee" />
      </div>
      <div className="col-span-3 sm:col-span-2 gap-2">
        <span>Unit</span>
        <FormInput name={`items[${index}].unit`} placeholder="pc" />
      </div>

      <div className="col-span-3 sm:col-span-2 gap-2">
        <span>Currency</span>
        <FormDropdown
          name={`items[${index}].currency`}
          placeholder="BDT"
          items={CURRENCY}
        />
      </div>
      <div className="col-span-3 sm:col-span-2 gap-2">
        <span>Price</span>
        <FormInput
          name={`items[${index}].price`}
          type="number"
          placeholder="0.00"
        />
      </div>
      <div className="col-span-3 sm:col-span-2 gap-2">
        <span>Quantity</span>
        <FormInput
          name={`items[${index}].quantity`}
          type="number"
          placeholder="1"
        />
      </div>
      <div className="col-span-3 sm:col-span-2 gap-2">
        <span>Line Total</span>
        <FormInput name={`items[${index}].line_total`} type="number" readOnly />
        <Subtle>auto price × qty</Subtle>
      </div>

      {/* Options: name/value pairs */}
      <div className="col-span-6">
        <span className="block font-semibold">Options</span>
        <FieldArray
          name={`items[${index}].options`}
          render={({ push, remove }) => (
            <div className="space-y-2">
              {(getIn(values, `items[${index}].options`) || []).map((_, oi) => (
                <div
                  key={oi}
                  className="grid gird-cols-2 sm:grid-cols-3 gap-2 items-end"
                >
                  <div className="col-span-1">
                    <span>Name</span>
                    <FormInput
                      name={`items[${index}].option[${oi}].name`}
                      value={values?.items[index]?.options[oi]?.name}
                      placeholder="Color"
                    />
                  </div>
                  <div className="col-span-1">
                    <span>Value</span>
                    <FormDropdown
                      name={`items[${index}].option[${oi}].value`}
                      value={values?.items[index]?.options[oi]?.name}
                      items={_?.value}
                      placeholder="Select"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => remove(oi)}
                      className="text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="text-sm underline"
                onClick={() => push({ name: "", value: "" })}
              >
                + Add option
              </button>
            </div>
          )}
        />
      </div>

      {/* Inventory Allocation (optional, simple row) */}
      <div className="col-span-6">
        <span className="block">Inventory Allocation</span>
        <FieldArray
          name={`items[${index}].inventory_allocation`}
          render={({ push, remove }) => (
            <div className="space-y-2">
              {(
                getIn(values, `items[${index}].inventory_allocation`) || []
              ).map((_, ai) => (
                <div key={ai} className="grid grid-cols-3 gap-2 items-end">
                  <div>
                    <span>Location</span>
                    <FormInput
                      name={`items[${index}].inventory_allocation[${ai}].location_code`}
                      placeholder="MAIN"
                    />
                  </div>
                  <div>
                    <span>Qty</span>
                    <FormInput
                      name={`items[${index}].inventory_allocation[${ai}].qty`}
                      type="number"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => remove(ai)}
                      className="text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="text-sm underline"
                onClick={() => push({ location_code: "MAIN", qty: 0 })}
              >
                + Add allocation
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default OrderDetailsFormUp;
