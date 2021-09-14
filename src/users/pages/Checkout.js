import { Button, Card, Dialog, DialogContent, DialogTitle, Divider, Grid, StylesProvider } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getCookie, SendRequestFormData } from "../../api/ApiRequest";
import { CartSliceActions } from "../../user_store/CartSlice";
import AddressCard from "../component/AddressCard";
import AddressForm from "../component/AddressForm";
import PaymentCard from "../component/PaymentCard";
import PriceDetails from "../component/PriceDetails";
import classes from "./Checkout.module.scss";
import MyCart from "./MyCart";
const Checkout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const customerId = useSelector((state) => state.account.account.customerId);
  console.log("customer id during initation ", customerId);
  const [openPopup, setOpenPopup] = useState(false);

  const [addressConfirm, setAddressConfirm] = useState(false);
  const [cartConfirm, setCartConfirm] = useState(false);

  const [shipmentId, setShipmentId] = useState(null);

  const confirmAddressHandler = (id) => {
    setShipmentId(id);
    setAddressConfirm(true);
  };
  const reviewAddressHandler = () => {
    setAddressConfirm(false);
  };

  const addresses = useSelector((state) => state.account.addresses);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const clearMyCart = () => {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    const formData = new FormData();
    formData.append("token", token);
    SendRequestFormData({ path: "clear-my-cart", method: "PUT", formData: formData, token: token })
      .then((data) => {
        setOpenPopup(true);
        dispatch(CartSliceActions.addAllToCart([]));
      })
      .catch((error) => {
        window.alert(error);
      });
  };
  const takeAction = () => {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    const formData = new FormData();
    formData.append("token", token);
    formData.append("addressId", shipmentId);
    formData.append("paymentType", "COD");

    SendRequestFormData({ path: "order-cart-items", method: "PUT", formData: formData, token: token })
      .then((data) => {
        clearMyCart();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <StylesProvider injectFirst>
      <Card className={classes.container}>
        <Grid container>
          <Grid item xs={8}>
            <Divider />
            <div className={classes.loginCheckout}>
              <h4 className={classes.heading}>Address</h4>
              {addressConfirm && <CheckCircleIcon color="action" />}
              {addressConfirm && (
                <Button color="primary" onClick={reviewAddressHandler}>
                  Edit
                </Button>
              )}
            </div>
            <Divider />
            {!addressConfirm &&
              addresses.map((item) => (
                <AddressCard item={item} key={item.addressId} confirmAddressHandler={confirmAddressHandler} />
              ))}
            <Card>
              <div className={classes.addressesForm}>
                {!addressConfirm && (
                  <h4
                    className={classes.newAddressButton}
                    onClick={() => {
                      setShowAddressForm(true);
                    }}
                  >
                    Add New Address
                  </h4>
                )}
                {showAddressForm && !addressConfirm && (
                  <AddressForm confirmAddressHandler={confirmAddressHandler} setShowAddressForm={setShowAddressForm} />
                )}
              </div>
            </Card>
            <Divider />
            <div>
              <Card className={classes.orderSummary}>
                <h4>Order Summary</h4>
                {cartConfirm && <CheckCircleIcon color="action" />}
                {cartConfirm && (
                  <Button
                    color="primary"
                    onClick={() => {
                      setCartConfirm(false);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </Card>
            </div>
            <div className={classes.payment}>
              {addressConfirm && cartConfirm && (
                <PaymentCard
                  confirmOrder={() => {
                    takeAction();
                  }}
                />
              )}
            </div>
          </Grid>
          {(!addressConfirm || (addressConfirm && cartConfirm)) && (
            <Grid item xs={4}>
              <PriceDetails />
            </Grid>
          )}
        </Grid>
        {addressConfirm && !cartConfirm && <MyCart item={true} />}

        {addressConfirm && !cartConfirm && (
          <div className={classes.paymentInitiatorButton}>
            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: "cadetblue" }}
              onClick={() => {
                setCartConfirm(true);
              }}
            >
              Proceed to Payment
            </Button>
          </div>
        )}
      </Card>

      <Dialog
        open={openPopup}
        onClose={() => {
          setOpenPopup(false);
          history.push("/home");
        }}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
      >
        <DialogTitle>Order Confirmation</DialogTitle>
        <DialogContent>
          <div className={classes.successMsg}>
            <div>Your order has been placed successfully</div>
            <CheckCircleIcon color="primary" variant="contained" />
          </div>
        </DialogContent>
      </Dialog>
    </StylesProvider>
  );
};

export default Checkout;
