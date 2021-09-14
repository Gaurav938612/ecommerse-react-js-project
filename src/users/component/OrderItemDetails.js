import { Card, StylesProvider } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { useState } from "react";
import OrderItem from "./OrderItem";
import OrderItemCard from "./OrderItemCard";
import classes from "./OrderItemDetails.module.scss";

const OrderItemDetails = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [amount, setAmount] = useState(0);
  const toggleView = () => {
    setShowDetails(!showDetails);
  };
  return (
    <StylesProvider injectFirst>
      <div className={classes.orderContainer}>
        <Card>
          <div className={classes.orderHeading}>
            <span>Order Number : {props.item.orderId} </span>
            <span>Total amount : {props.item.totalAmount} </span>
            <span>STATUS : {props.item.status} </span>
            {!showDetails && (
              <div
                className={classes.arrowIcon}
                onClick={() => {
                  toggleView();
                }}
              >
                <ArrowDropDownIcon />
              </div>
            )}
            {showDetails && (
              <div
                className={classes.arrowIcon}
                onClick={() => {
                  toggleView();
                }}
              >
                <ArrowDropUpIcon />
              </div>
            )}
          </div>
        </Card>
        {showDetails && <OrderItemCard orderId={props.item.orderId} setAmount={setAmount} />}

        {showDetails && (
          <div className={classes.orderDetails}>
            <OrderItem order_details={props.item} amount={amount} />
          </div>
        )}
      </div>
    </StylesProvider>
  );
};
export default OrderItemDetails;
