import { Card, Divider } from "@material-ui/core";
import { StylesProvider } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getCookie, SendRequest, SendRequestFormData } from "../../api/ApiRequest";
import classes from "./OrderItemCard.module.scss";

const getImageSrc = (byteArray) => {
  var img = null;
  if (byteArray != null) img = new Buffer.from(byteArray).toString("base64");
  const file = "data:image/png;base64," + img;
  return file;
};
const OrderItemCard = (props) => {
  const history = useHistory();
  const [orderDetails, setOrderDetails] = useState([]);
  function fetchOrders() {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    SendRequest({ path: `fetch-an-order/${props.orderId}`, method: "GET", token: token, extra: "fetch-an-order" })
      .then((data) => {
        var amt = 0;
        data.map((item) => {
          amt += item.product.price * item.quantity;
        });
        props.setAmount(amt);
        setOrderDetails(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <StylesProvider injectFirst>
      {orderDetails.map((item) => (
        <Card>
          <div className={classes.container}>
            <div className={classes.upperPart}>
              <img src={getImageSrc(item.product.image)}></img>
              <div className={classes.rightUpper}>
                <span className={classes.title}>
                  {item.product.title}({item.quantity}
                  {item.quantity == 1 ? "item" : "items"})
                </span>
                <span className={classes.price}>₹{item.subtotalAmount}</span>
              </div>
            </div>

            <Divider />
          </div>
        </Card>
      ))}
    </StylesProvider>
  );
};

export default OrderItemCard;
