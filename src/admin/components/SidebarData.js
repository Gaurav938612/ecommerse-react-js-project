import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export const SidebarData = [
  {
    title: "Home",
    path: "/admin",
    icon: <AiIcons.AiFillHome />,
  },
  {
    title: "View Products",
    path: "/admin/view-products",
    icon: <IoIcons.IoIosPaper />,
  },
  {
    title: "Orders",
    path: "/admin/view-orders",
    icon: <FaIcons.FaCartPlus />,
  },
  {
    title: "Log out",
    path: "/",
    icon: <ExitToAppIcon />,
  },
];
