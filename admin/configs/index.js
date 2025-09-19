import {
  FiUsers,
  FiUser,
  FiCompass,
  FiGift,
  FiSettings,
  FiLayers,
  FiShoppingCart,
} from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { RiShoppingBag3Line } from "react-icons/ri";
import { AiOutlineBars, AiOutlineAppstoreAdd } from "react-icons/ai";
import { ImCreditCard } from "react-icons/im";
import { TbFileReport } from "react-icons/tb";
import { GiAmpleDress } from "react-icons/gi";

export const menus = [
  {
    pathname: "/",
    Icon: RxDashboard,
    title: "Dashboard",
    secure: false,
  },
  {
    pathname: "/products",
    Icon: RiShoppingBag3Line,
    title: "Products",
    secure: true,
  },
  {
    pathname: "/place-order",
    Icon: AiOutlineAppstoreAdd,
    title: "Place Order",
    secure: true,
  },
  {
    pathname: "/delivery-report",
    Icon: TbFileReport,
    title: "Delivery Report",
    secure: true,
  },
  {
    pathname: "/support-tickets",
    Icon: RiShoppingBag3Line,
    title: "Support Tickets",
    secure: true,
  },
  {
    pathname: "/category",
    Icon: AiOutlineBars,
    title: "Category",
    secure: true,
  },
  {
    pathname: "/customers",
    Icon: FiUsers,
    title: "Customers",
    secure: true,
  },
  {
    pathname: "/orders",
    Icon: FiCompass,
    title: "Orders",
    secure: true,
  },

  {
    pathname: "/our-staff",
    Icon: FiUser,
    title: "Our Staff",
    secure: true,
  },
  {
    pathname: "/setting",
    Icon: FiSettings,
    title: "Setting",
    secure: true,
  },
];

//Dashboard Total Card
export const priceOverview = [
  {
    title: "today order",
    Icon: FiLayers,
    price: 100,
    bg: "blue",
  },
  {
    title: "this month",
    Icon: FiShoppingCart,
    price: 1000,
    bg: "sky",
  },
  {
    title: "total order",
    Icon: ImCreditCard,
    price: 43000,
    bg: "green",
  },
];

//Products Category

export const PCATEGORY = [
  {
    name: "রাজশাহীর আম",
    id: "রাজশাহীর আম",
    path: "/rajshahiraam",
  },
  {
    name: "Jannat Fashon",
    id: "Jannat Fashon",
    path: "/JannatFashon",
  },
  {
    name: "খেজুরের গুড়",
    id: "খেজুরের গুড়",
    path: "/khejurergru",
  },
  {
    name: "আখের গুড়",
    id: "আখের গুড়",
    path: "/akher-gur",
  },
  {
    name: "মধু",
    id: "মধু",
    path: "/modhu",
  },
  {
    name: "সরিষার তেল",
    id: "সরিষার তেল",
    path: "/sorishar-tel",
  },
  {
    name: "রংপুরের আম",
    id: "রংপুরের আম",
    path: "/rongpureraam",
  },
];
export const CATEGORY = [
  {
    name: "Fashon",
    id:"Fashon"
  },
  {
    name: "Organic Food",
    id: "Organic Food"
  },
  {
    name: "Mangoo",
    id: "Mangoo"
  }
];

export const CCATEGORY = [
  {
    name: "Lungi",
    id: "Lungi",
  },
  {
    name: "খেজুরের পাটালি গুড় (গোল)",
    id: "খেজুরের পাটালি গুড় (গোল)",
  },
  {
    name: "খেজুরের পাটালি গুড় (পাটা)",
    id: "খেজুরের পাটালি গুড় (পাটা)",
  },
  {
    name: "খেজুরের পাটালি গুড় (ফয়েল)",
    id: "খেজুরের পাটালি গুড় (ফয়েল)",
  },
  {
    name: "খেজুরের পাটালি গুড় (Narkel)",
    id: "খেজুরের পাটালি গুড় (Narkel)",
  },
  {
    name: "খেজুরের লিকুইড / লালি গুড়",
    id: "খেজুরের লিকুইড / লালি গুড়",
  },
  {
    name: "খেজুরের ঝোলা / দানা গুড়",
    id: "খেজুরের ঝোলা / দানা গুড়",
  },

  {
    name: "গোপালভোগ",
    id: "গোপালভোগ",
  },
  {
    name: "হিমসাগর",
    id: "হিমসাগর",
  },
  {
    name: "ল্যাংড়া",
    id: "ল্যাংড়া",
  },
  {
    name: "আম্রপালি",
    id: "আম্রপালি",
  },
  {
    name: "হাড়িভাঙ্গা",
    id: "হাড়িভাঙ্গা",
  },
  {
    name: "বোম্বাই লিচু",
    id: "বোম্বাই লিচু",
  },
  {
    name: "চায়না 3 লিচু",
    id: "চায়না 3 লিচু",
  },
  {
    name: "আখের ঝোলা গুড়",
    id: "আখের ঝোলা গুড়",
  },
  {
    name: "আখেল দানা গুড়",
    id: "আখেল দানা গুড়",
  },
  {
    name: "আখেল লিকুইড গুড়",
    id: "আখেল লিকুইড গুড়",
  },
  {
    name: "খাটি ঘি",
    id: "খাটি ঘি",
  },
  {
    name: "প্রাকৃতিক মধু",
    id: "প্রাকৃতিক মধু",
  },
  {
    name: "চাষকৃত মধু",
    id: "চাষকৃত মধু",
  },
  {
    name: "সরিষার তেল",
    id: "সরিষার তেল",
  },
  {
    name: "পেয়ারা",
    id: "পেয়ারা",
  },
  {
    name: "রংপুরের আম",
    id: "রংপুরের আম",
  },
];

export const TCATEGORY = [
  {
    name: "Lungi",
    id: "Lungi",
  },
  {
    name: "আম",
    id: "আম",
  },
  {
    name: "খেজুরের গুড়",
    id: "খেজুরের গুড়",
  },
  {
    name: "লিচু",
    id: "লিচু",
  },
  {
    name: "আখের গুড়",
    id: "আখের গুড়",
  },
];

export const ROLE = [
  {
    name: "Admin",
    id: "Admin",
  },
  {
    name: "HR",
    id: "HR",
  },
  {
    name: "Sales Executive",
    id: "Sales Executive",
  },
];

export const STATUS = [
  { id: "Pending", name: "Pending" },
  { id: "Processing", name: "Processing" },
  { id: "Shipped", name: "Shipped" },
  { id: "Delivered", name: "Delivered" },
  { id: "Cancelled", name: "Cancelled" },
];

export const ERROR_MEANINGS = {
  0: "Success. Everything worked as expected.",
  400: "Missing or invalid parameter.",
  403: "Permission denied.",
  404: "Resource not found.",
  405: "Authorization required.",
  409: "Unknown server error.",
  410: "Account expired.",
  411: "Reseller account expired or suspended.",
  412: "Invalid schedule.",
  413: "Invalid Sender ID.",
  414: "Message is empty.",
  415: "Message is too long.",
  416: "No valid number found.",
  417: "Insufficient balance.",
  420: "Content blocked.",
  421: "Only registered phone number allowed until first recharge.",
};
