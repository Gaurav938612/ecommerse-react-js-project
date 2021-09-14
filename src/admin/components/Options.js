import OptionItem from "./OptionItem";
import classes from "./Options.module.scss";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import { useHistory } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AccountSliceActions } from "../../user_store/AccountSlice";
import { getCookie, SendRequest } from "../../api/ApiRequest";
import { CartSliceActions } from "../../user_store/CartSlice";

function Options() {
  const dispatch = useDispatch();
  const history = useHistory();
  const fetchAccount = (token) => {
    SendRequest({ path: `account/${token}`, method: "GET", token: token })
      .then((value) => {
        console.log("fetched account is", value);
        if (typeof value !== "undefined") {
          dispatch(AccountSliceActions.storeAccountData(value));
        }
      })
      .catch((error) => {
        window.confirm(error);
      });
  };
  useEffect(() => {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      dispatch(CartSliceActions.refreshData());
      dispatch(AccountSliceActions.refreshData());
      history.push("/authenticate");
      return;
    }
    fetchAccount(token);
  }, []);
  const account = useSelector((state) => state.account.account);
  if (account.roles === "") {
    return <div></div>;
  }
  return (
    <div className={classes.container}>
      <OptionItem text="View Products" link="/admin/view-products" icon={<LocalShippingOutlinedIcon />} />
      <OptionItem text="Orders" link="/admin/view-orders" />
    </div>
  );
}

export default Options;
