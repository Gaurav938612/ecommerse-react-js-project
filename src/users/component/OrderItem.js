import { Button, Grid, StylesProvider } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router";
import { getCookie, SendRequestFormData } from "../../api/ApiRequest";
import ConfirmationDialog from "../../layout/ConfirmationDialog";
import classes from "./OrderItem.module.scss";

const OrderItem = (props) => {
  const details = props.order_details;
  const product_details = details.product;
  const shipment_details = details.shipmentAddress;
  const customer_details = shipment_details.customer;

  const history = useHistory();
  //   details.status = "PLACED";
  const information = {
    PLACED: "The order has been placed ",
    CANCELLED: "The Order has been cancelled",
    CONFIRMED: "The Order has been acceded by admin, yet to be shipped",
    SHIPPED: "The Order has been shipped",
  };
  const [status_info, setStatus_info] = useState(information[details.status]);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [status, setStatus] = useState(details.status);
  const [action, setAction] = useState("");
  const dialogInitialParams = {
    cancel: "NO",
    color_cancel: "primary",
    ok: "Yes, Cancel the order",
    color_ok: "secondary",
    message: "",
  };
  const [dialogParams, setDialogParams] = useState(dialogInitialParams);
  const takeAction = () => {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    setOpenConfirmDialog(false);
    const formData = new FormData();

    formData.append("orderId", details.orderId);
    formData.append("token", token);
    SendRequestFormData({ path: "cancel-my-order", method: "PUT", formData: formData, token: token })
      .then((value) => {
        console.log(value);
        setStatus_info(information[action]);
        setStatus(action);
        window.confirm("Order Cancelled successfully");
      })
      .catch((error) => {
        console.log(error);
        window.alert("failed to connect");
      });
  };

  return (
    <StylesProvider injectFirst>
      <div className={classes.container}>
        <Grid container className={classes.content}>
          <Grid item xs={6}>
            <h3>Billing Details</h3>
            <Grid container className={classes.child}>
              <Grid item xs={1}></Grid>
              <Grid item xs={4}>
                <div>Name:</div>
                <div>Email address:</div>
                {customer_details.phNo != null && <div>Ph.no. - </div>}
                <div>Payment Type :</div>
                <div>Amount</div>
                <div>Status :</div>
              </Grid>
              <Grid item xs={7}>
                <div>{customer_details.firstName + " " + customer_details.lastName}</div>
                <div style={{ textTransform: "lowercase" }}>{customer_details.email}</div>
                <div>{customer_details.phNo}</div>
                <div>{details.paymentType}</div>
                <div>₹{props.amount} </div>
                <div>{status}</div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <h3>Shipment Address</h3>
            <Grid container className={classes.child}>
              <Grid item xs={1}></Grid>
              <Grid item xs={4}>
                <div>Address Line 1</div>
                <div>Address Line 2</div>
                <div>City:</div>
                <div>State:</div>
                <div>Pin code :</div>
                <div>Contact No :</div>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={5}>
                <div>{shipment_details.addressLine1}</div>
                <div>{shipment_details.addressLine2}</div>
                <div>{shipment_details.city}</div>
                <div>{shipment_details.state + " (" + shipment_details.country + ")"}</div>
                <div>{shipment_details.pinCode}</div>
                <div>{shipment_details.contactNo}</div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div className={classes.button}>
          {(status === "CONFIRMED" || status === "PLACED") && (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.btn2}
              onClick={() => {
                setAction("CANCELLED");
                setOpenConfirmDialog(true);
                setDialogParams({
                  cancel: "No",
                  color_cancel: "",
                  ok: "Yes,Cancel the order",
                  color_ok: "secondary",
                  message: "Do you want to cancel the order",
                });
              }}
            >
              Cancel order
            </Button>
          )}
        </div>
      </div>
      <hr />
      <ConfirmationDialog
        onClose={() => {
          setOpenConfirmDialog(false);
        }}
        handleAction={takeAction}
        open={openConfirmDialog}
        cancel={dialogParams.cancel}
        color_cancel={dialogParams.color_cancel}
        ok={dialogParams.ok}
        color_ok={dialogParams.color_ok}
      >
        {dialogParams.message}
      </ConfirmationDialog>
    </StylesProvider>
  );
};

export default OrderItem;
