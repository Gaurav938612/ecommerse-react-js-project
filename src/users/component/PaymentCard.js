import { Button, StylesProvider } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import classes from "./PaymentCard.module.scss";
const PaymentCard = (props) => {
  const [value, setValue] = React.useState("COD");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <StylesProvider injectFirst>
      <div className={classes.container}>
        <FormControl component="fieldset">
          <h4>Payment</h4>
          <RadioGroup
            aria-label="Payment Options"
            name="payment_options"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="COD"
              control={<Radio />}
              label="COD (Cash on Delivery)"
            />
          </RadioGroup>
          <div className={classes.paymentButton}>
            <Button
              style={{
                backgroundColor: "cadetblue",
                color: "white",
                marginLeft: "6rem",
              }}
              variant="contained"
              onClick={props.confirmOrder}
            >
              Place Order
            </Button>
          </div>
        </FormControl>
      </div>
    </StylesProvider>
  );
};
export default PaymentCard;
