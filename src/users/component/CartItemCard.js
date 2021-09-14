import { Button, Card, Divider, StylesProvider } from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { getImageSrc } from "../../api/ApiRequest";
import classes from "./CartItemCard.module.scss";

const CartItemCard = (props) => {
  return (
    <StylesProvider injectFirst>
      <Card>
        <div className={classes.container}>
          <div className={classes.upperPart}>
            <div className={classes.imageBox}>
              <img src={getImageSrc(props.image)}></img>
            </div>
            <div className={classes.rightUpper}>
              <span className={classes.title}>{props.title}</span>
              <span className={classes.description}>{props.description}</span>
              <span className={classes.price}>Price:&nbsp;&nbsp; ₹{props.price * props.quantity}</span>
            </div>
          </div>
          <div className={classes.lowerPart}>
            <span
              className={classes.icon}
              onClick={() => {
                props.manageCart(props.customerId, props.productId, -1);
              }}
            >
              <RemoveCircleOutlineOutlinedIcon color="primary" />
            </span>
            <span className={classes.quantity}>{props.quantity}</span>

            <span
              className={classes.icon}
              onClick={() => {
                props.manageCart(props.customerId, props.productId, 1);
              }}
            >
              <AddCircleOutlineOutlinedIcon color="primary" />
            </span>
            <div
              className={classes.button}
              onClick={() => {
                props.manageCart(props.customerId, props.productId, 0);
              }}
            >
              <Button color="primary">REMOVE&nbsp;&nbsp;</Button>
            </div>
          </div>
          <Divider />
        </div>
      </Card>
    </StylesProvider>
  );
};
export default CartItemCard;
