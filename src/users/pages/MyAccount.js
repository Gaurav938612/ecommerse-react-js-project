import { Card, Divider, Grid } from "@material-ui/core";
import { StylesProvider } from "@material-ui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getCookie, SendRequest, setCookie } from "../../api/ApiRequest";
import { AccountSliceActions } from "../../user_store/AccountSlice";
import { CartSliceActions } from "../../user_store/CartSlice";
import AddressBook from "../component/AddressBook";
import OrderItemDetails from "../component/OrderItemDetails";
import classes from "./MyAccount.module.scss";
const MyAccount = () => {
  const history = useHistory();
  const disptch = useDispatch();
  const account = useSelector((state) => state.account.account);
  const orders = useSelector((state) => state.account.orders);

  const [option, setOption] = useState(1);
  const fetchAddress = () => {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    SendRequest({ path: `fetch-address/${token}`, method: "GET", token: token })
      .then((data) => {
        console.log("fetched address", data);
        disptch(AccountSliceActions.storeAddresses(data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function fetchMyOrders() {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    SendRequest({ path: `view-my-orders/${token}`, method: "GET", token: token, extra: "view-my-orders" })
      .then((data) => {
        disptch(AccountSliceActions.storeOrders(data));
      })
      .catch((error) => {
        window.alert(error);
        console.log(error);
      });
  }

  useEffect(() => {
    fetchMyOrders();
    fetchAddress();
  }, []);
  return (
    <StylesProvider injectFirst>
      <div className={classes.container}>
        <div className={classes.heading}>My Account</div>
        <div className={classes.container_card}>
          <Card>
            <Grid container>
              <Grid item xs={3}>
                <h3>Personal Information</h3>
                <Divider />
                <div className={classes.menu}>
                  <ul>
                    <li
                      onClick={() => {
                        setOption(1);
                      }}
                      style={option == 1 ? { backgroundColor: "#e1e1e1" } : {}}
                    >
                      Account Info
                    </li>
                    <li
                      onClick={() => {
                        setOption(2);
                      }}
                      style={option == 2 ? { backgroundColor: "#e1e1e1" } : {}}
                    >
                      My Orders
                    </li>
                    <li
                      onClick={() => {
                        setOption(3);
                      }}
                      style={option == 3 ? { backgroundColor: "#e1e1e1" } : {}}
                    >
                      Address Book
                    </li>
                    <li
                      onClick={() => {
                        setCookie("token", "");
                        disptch(CartSliceActions.refreshData());
                        disptch(AccountSliceActions.refreshData());
                        history.push("/home");
                      }}
                    >
                      Log out
                    </li>
                  </ul>
                </div>
              </Grid>
              <Grid item xs={9}>
                <Grid item xs={12}>
                  {option === 1 && (
                    <div className={classes.accountInfoCard}>
                      {/* <Card> */}
                      <div className={classes.accountInfo}>
                        <div className={classes.content}>
                          <span>Name:&nbsp; </span>
                          <span className={classes.name}>
                            {account.firstName} {account.lastName}
                          </span>
                        </div>
                        <div className={classes.content}>
                          <span>Email:&nbsp; </span>
                          <span>{account.email}</span>
                        </div>
                        <div className={classes.content}>
                          <span>Ph.no.&nbsp; </span>
                          <span>{account.phNo}</span>
                        </div>
                      </div>
                      {/* </Card> */}
                    </div>
                  )}
                  {option === 2 && orders.map((item) => <OrderItemDetails item={item} />)}
                  {option === 3 && <AddressBook />}
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </div>
      </div>
    </StylesProvider>
  );
};
export default MyAccount;
