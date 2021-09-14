import { Button, IconButton, StylesProvider } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FeedSliceActions } from "../user_store/FeedSlice";
import { LoadingBarSliceActions } from "../user_store/LoadingBarSlice";
import CartIcon from "./CartIcon";
import classes from "./Header.module.scss";
import UserNavBar from "./UserNavBar";
const Header = () => {
  const firstName = useSelector((state) => state.account.account.firstName);
  console.log("first name", firstName);
  const history = useHistory();
  const checkCartItems = () => {
    if (firstName === "") history.push("/authenticate");
    else {
      history.push("/my-cart");
    }
  };
  console.log("rendering Header Components");
  const dispatch = useDispatch();
  const fetchProducts = () => {
    dispatch(LoadingBarSliceActions.updateStatusBar(true));
    fetch("http://localhost:8080/view-products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((Response) => {
        return Response.json();
      })
      .then((data) => {
        console.log(data);
        dispatch(FeedSliceActions.updateProducts(data));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch(LoadingBarSliceActions.updateStatusBar(false));
      });
  };

  const [showSideBar, setShowSideBar] = useState(false);
  const show = () => {
    console.log("show called");
    setShowSideBar(!showSideBar);
  };
  const account = useSelector((state) => state.account.account);
  if (account.roles === "ROLE_ADMIN") history.push("/admin");
  return (
    <StylesProvider injectFirst>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <div className={classes.menuIcon}>
            <IconButton
              //   edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={show}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <h1
            className={classes.heading}
            onClick={() => {
              history.push("/home");
            }}
          >
            E-commerce
          </h1>
        </div>

        <div className={classes.headerRight}>
          {firstName === "" && (
            <Button
              // variant="outlined"
              style={{ height: "2rem", marginTop: "1.5rem", color: "white" }}
              onClick={() => {
                history.push("./authenticate");
              }}
            >
              Login
            </Button>
          )}
          {firstName !== "" && (
            <h4
              className={classes.loginButton}
              onClick={() => {
                history.push("./my-account");
              }}
            >
              Hi {firstName}..
            </h4>
          )}
          <div className={classes.cartIcon}>
            <CartIcon onClick={checkCartItems} />
          </div>
        </div>
      </div>
      <div style={{ height: "6rem" }}></div>
      <UserNavBar sideBar={showSideBar} setShowSideBar={setShowSideBar} />
    </StylesProvider>
  );
};

export default Header;
