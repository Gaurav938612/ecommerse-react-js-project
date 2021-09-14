import {
  IconButton, StylesProvider
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import classes from "./AdminHeader.module.scss";
import AdminNavBar from "./AdminNavBar";
const AdminHeader = () => {
  const history = useHistory();

  const account = useSelector((state) => state.account.account);
  console.log(account);

  if (account.roles !== "") {
    if (account.roles !== "ROLE_ADMIN") history.push("/unauthorized");
  }
  console.log("rendering Header Components");
  const dispatch = useDispatch();

  const [showSideBar, setShowSideBar] = useState(false);
  const show = () => {
    console.log("show called");
    setShowSideBar(!showSideBar);
  };
  if (account.roles === "")
    return (
      <div style={{ margin: "2rem 2rem  " }}>
        {/* <h1>Authentication required for this page</h1>
        <Button
          color="primary"
          onClick={() => {
            history.push("/authenticate");
          }}
        >
          Go to Login page
        </Button> */}
      </div>
    );
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
              history.push("/admin/");
            }}
          >
            E-commerce
          </h1>
        </div>
      </div>
      <div style={{ height: "6rem" }}></div>
      <AdminNavBar sideBar={showSideBar} setShowSideBar={setShowSideBar} />
    </StylesProvider>
  );
};

export default AdminHeader;
