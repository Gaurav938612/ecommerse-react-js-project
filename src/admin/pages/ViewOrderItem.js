import Box from "@material-ui/core/Box";
import { makeStyles, StylesProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { getCookie, SendRequestFormData } from "../../api/ApiRequest";
import OrderDetailsTab from "./OrderDetailsTab";
import PreviewOrderItem from "./PreviewOrderItem";
import styles from "./ViewOrderItem.module.scss";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));
const initialDetails = {
  orderId: "",
  paymentType: "",
  status: "",
  totalAmont: "",
  shipmentAddress: {
    addressId: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    contactNo: "",
    country: "",
    customer: {
      customerId: 1,
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phNo: null,
      roles: "",
    },
  },
};
export default function ViewOrderItem(props) {
  const queryParams = new URLSearchParams(window.location.search);

  const orderId = queryParams.get("orderId");
  const history = useHistory();

  const [orderDetails, setOrderDetails] = useState([]);
  const [RestDetails, setRestDetails] = useState(initialDetails);
  function fetchOrders() {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    if (orderId === null) return;

    SendRequestFormData({ path: `admin/fetch-an-order/${orderId}`, method: "GET", token: token })
      .then((data) => {
        console.log("response ok came for view order item", data);
        setOrderDetails(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function viewOrder() {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    SendRequestFormData({ path: `admin/view-an-order-details/${orderId}`, method: "GET", token: token })
      .then((data) => {
        console.log("view an order details", data);
        setRestDetails(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchOrders();
    viewOrder();
  }, []);
  const account = useSelector((state) => state.account.account);
  if (account.roles === "") {
    return <div></div>;
  }
  return (
    <StylesProvider injectFirst>
      <div className={styles.container}>
        <OrderDetailsTab orderDetails={orderDetails} />
        <PreviewOrderItem details={RestDetails} />
      </div>
    </StylesProvider>
  );
}
