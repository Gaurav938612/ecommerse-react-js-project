import { Button, Card, Divider, Grid, StylesProvider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getCookie, SendRequest, SendRequestFormData } from "../../api/ApiRequest";
import { CartSliceActions } from "../../user_store/CartSlice";
import CartItemCard from "../component/CartItemCard";
import PriceDetails from "../component/PriceDetails";
import classes from "./MyCart.module.scss";

const MyCart = (props) => {
  const history = useHistory();
  const customerId = useSelector((state) => state.account.account.customerId);
  const dispatch = useDispatch();
  const cartitems = useSelector((state) => state.cart.cartitems);
  const { quantity, amount } = useSelector((state) => state.cart.priceitems);
  const manageCart = (customer_id, product_id, quantity) => {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    console.log("params is ", customer_id, product_id, quantity);
    const formData = new FormData();
    formData.append("customer_id", parseInt(customer_id));
    formData.append("product_id", parseInt(product_id));
    formData.append("quantity", quantity);
    SendRequestFormData({ path: "update-cart-item", method: "PUT", formData: formData, token: token })
      .then((data) => {
        if (data.message === "done") init();
        else if (data.message === "not enough in inventory") {
          window.alert(data.message);
        }
      })
      .catch((error) => {
        window.alert(error);
      });
  };
  const init = async () => {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    SendRequest({ path: `view-my-cart/${token}`, method: "GET", token: token })
      .then((data) => {
        dispatch(CartSliceActions.addAllToCart(data));
      })
      .catch((error) => {
        window.alert(error);
      });
  };

  return (
    <StylesProvider injectFirst>
      <Card className={classes.container}>
        <Grid container>
          <Grid item xs={8}>
            {props.item == null && <h4 className={classes.heading}>My Cart ({cartitems.length})</h4>}
            {props.item == null && <Divider />}
            {cartitems.map((item) => (
              <CartItemCard
                key={item.product.productId}
                productId={item.product.productId}
                customerId={customerId}
                title={item.product.title}
                price={item.product.price}
                image={item.product.image}
                description={item.product.description}
                quantity={item.quantity}
                manageCart={(customer_id, product_id, quantities) => {
                  manageCart(customer_id, product_id, quantities);
                }}
              />
            ))}

            {cartitems.length === 0 && (
              <div className={classes.emptyCart}>
                <h4>No cart items available</h4>
                <Button
                  color="primary"
                  onClick={() => {
                    history.push("/home");
                  }}
                >
                  Go to Shopping Page
                </Button>
              </div>
            )}
          </Grid>
          <Grid item xs={4}>
            <PriceDetails total_item={quantity} amount={amount} />
            {props.item == null && cartitems.length !== 0 && (
              <div className={classes.placeOrderButton}>
                <Button
                  style={{
                    backgroundColor: "cadetblue",
                    width: "70%",
                    fontSize: "16px",
                  }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    history.push("/checkout");
                  }}
                >
                  Checkout
                </Button>
              </div>
            )}
          </Grid>
          {/* )} */}
        </Grid>
      </Card>
    </StylesProvider>
  );
};

export default MyCart;
