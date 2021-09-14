import { Card, Divider } from "@material-ui/core";
import { StylesProvider } from "@material-ui/styles";
import { useSelector } from "react-redux";
import classes from "./PriceDetails.module.scss";

const PriceDetails = () => {
  // const amount = useSelector((state) => state.cart.cartitems);
  const priceitems = useSelector((state) => state.cart.priceitems);
  return (
    <StylesProvider injectFirst>
      <div className={classes.container}>
        <Card>
          <div className={classes.content}>
            <h4 className={classes.heading}>Price Details</h4>
            <div className={classes.item}>
              <span>
                Price ({priceitems.quantity}
                {priceitems.quantity === 1 ? " item" : " items"})
              </span>
              <span>₹{priceitems.amount}</span>
            </div>
            <div className={classes.item}>
              <span>Delivery Charges</span>
              <span className={classes.free}>FREE</span>
            </div>
            <Divider />
            <div className={classes.item}>
              <h4 className={classes.total}>Total Amount : </h4>
              <h4>₹{priceitems.amount}</h4>
            </div>
          </div>
        </Card>
      </div>
    </StylesProvider>
  );
};

export default PriceDetails;
