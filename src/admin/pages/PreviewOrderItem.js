import { Button, capitalize, Dialog, DialogTitle, Grid, StylesProvider } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useState } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router";
import { getCookie, SendRequestFormData } from "../../api/ApiRequest";
import ConfirmationDialog from "../../layout/ConfirmationDialog";
import { prettyDate } from "../../layout/Helper";
import classes from "./PreviewOrderItem.module.scss";

const PreviewOrderItem = (props) => {
  const shipment_details = props.details.shipmentAddress;
  const customer_details = shipment_details.customer;

  const information = {
    PLACED: "The order is in the pending state",
    CANCELLED: "The Order has been cancelled",
    CONFIRMED: "The Order has been acceded by admin, yet to be shipped",
    SHIPPED: "The Order has been shipped",
  };

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const status = props.details.status;
  const status_info = information[status];
  console.log("status as of now ", status);
  console.log(props.details);
  const [action, setAction] = useState("");
  const dialogInitialParams = {
    cancel: "NO",
    color_cancel: "primary",
    ok: "Yes, Cancel the order",
    color_ok: "secondary",
    message: "",
  };
  const [dialogParams, setDialogParams] = useState(dialogInitialParams);
  const [showAlert, setShowAlert] = useState({ message: "", status: false });
  const history = useHistory();
  const takeAction = () => {
    setOpenConfirmDialog(false);
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    const formData = new FormData();
    formData.append("action", action);
    formData.append("order_id", props.details.orderId);

    SendRequestFormData({ path: "admin/respond-order", method: "PUT", token: token, formData: formData })
      .then((value) => {
        setShowAlert({
          message: "Order " + capitalize(action.toLowerCase()) + " successfully",
          status: true,
        });
      })
      .catch((error) => {
        console.log(error);
        window.confirm("something went wrong");
      });
  };

  return (
    <StylesProvider injectFirst>
      <div className={classes.container}>
        <h4>
          Order Placed :&nbsp;&nbsp;
          {prettyDate(new Date(Date.parse(props.details.date)))}
        </h4>
        <Grid container className={classes.content}>
          <Grid item xs={6}>
            <h3>Billing Details</h3>

            <Grid container className={classes.child}>
              <Grid item xs={2}></Grid>
              <Grid item xs={4}>
                <div>Customer Name:</div>
                <div>Email address:</div>
                {customer_details.phNo != null && <div>Ph.no. - </div>}
                <div>Amount : </div>
                <div>Payment Type :</div>
                <div>Status :</div>
              </Grid>
              <Grid item xs={4}>
                <div>{customer_details.firstName + " " + customer_details.lastName}</div>
                <div style={{ textTransform: "lowercase" }}>{customer_details.email}</div>
                <div>{customer_details.phNo}</div>
                <div>₹{props.details.totalAmount}</div>
                <div>{props.details.paymentType}</div>
                <div>{status}</div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <h3>Shipment Address</h3>

            <Grid container className={classes.child}>
              <Grid item xs={3}></Grid>
              <Grid item xs={4}>
                <div>Address Line 1</div>
                <div>Address Line 2</div>
                <div>City:</div>
                <div>State:</div>
                <div>Pin code :</div>
                <div>Contact No :</div>
              </Grid>
              <Grid item xs={4}>
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

        <Alert severity="info">{status_info}</Alert>

        <div className={classes.button}>
          {(status === "PLACED" || status === "CONFIRMED") && (
            <Button
              variant="outlined"
              color="secondary"
              type="submit"
              className={classes.btn1}
              onClick={() => {
                setAction("CANCELLED");
                setOpenConfirmDialog(true);
                setDialogParams({
                  cancel: "NO",
                  color_cancel: "primary",
                  ok: "Yes, Cancel the order",
                  color_ok: "secondary",
                  message: "Do you want to cancel the order ?",
                });
              }}
            >
              Cancel
            </Button>
          )}
          {status === "PLACED" && (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.btn2}
              onClick={() => {
                setAction("CONFIRMED");
                setOpenConfirmDialog(true);
                setDialogParams({
                  cancel: "No",
                  color_cancel: "",
                  ok: "Yes, Confirm the order",
                  color_ok: "primary",
                  message: "Do you want to accept the order ?",
                });
              }}
            >
              Accept
            </Button>
          )}
          {status === "CONFIRMED" && (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.btn2}
              onClick={() => {
                setAction("SHIPPED");
                setOpenConfirmDialog(true);
                setDialogParams({
                  cancel: "Not now",
                  color_cancel: "",
                  ok: "Confirm",
                  color_ok: "primary",
                  message: "Confirm the shipment",
                });
              }}
            >
              Ship the order
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
      <Dialog
        open={showAlert.status}
        onClose={() => {
          setShowAlert({ message: "", status: false });
          window.location.reload();
        }}
      >
        <DialogTitle>{showAlert.message}</DialogTitle>
      </Dialog>
    </StylesProvider>
  );
};

export default PreviewOrderItem;
