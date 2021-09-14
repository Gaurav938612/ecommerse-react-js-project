import ShoppingCartOutlined from "@material-ui/icons/ShoppingCartOutlined";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import classes from "./CartIcon.module.scss";

const CartIcon = (props) => {
  console.log("rendering cart icon");
  const cartitems = useSelector((state) => state.cart.cartitems);
  return (
    <Fragment>
      <div className={classes.button} onClick={props.onClick}>
        <span className={classes.icon}>
          <ShoppingCartOutlined className={classes.icons} />
        </span>
        <span className={classes.badge}>{cartitems.length}</span>
      </div>
    </Fragment>
  );
};

export default CartIcon;
