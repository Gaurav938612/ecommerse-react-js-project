import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import CloseIcon from "@material-ui/icons/Close";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { setCookie } from "../api/ApiRequest";
import { AccountSliceActions } from "../user_store/AccountSlice";
import { CartSliceActions } from "../user_store/CartSlice";
import classes from "./UserNavBar.module.scss";

const UserNavBar = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const customerId = useSelector((state) => state.account.account.customerId);
  return (
    <div>
      <nav className={props.sideBar ? `${classes.nav_menu} ${classes.active}` : classes.nav_menu}>
        <ul className={classes.nav_menu_items} onClick={props.showSidebar}>
          <div className={classes.navbar_toggle}>
            <CloseIcon
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => {
                props.setShowSideBar(false);
              }}
            />
          </div>

          <li className={classes.nav_text}>
            <Link
              to="/home"
              onClick={() => {
                props.setShowSideBar(false);
              }}
            >
              <HomeRoundedIcon />
              <span>Home</span>
            </Link>
          </li>
          {customerId !== "" && (
            <li className={classes.nav_text}>
              <Link
                to="/my-account"
                onClick={() => {
                  props.setShowSideBar(false);
                }}
              >
                <AccountCircleRoundedIcon />
                <span>My Account</span>
              </Link>
            </li>
          )}
          {customerId === "" && (
            <li className={classes.nav_text}>
              <Link
                to="/authenticate"
                onClick={() => {
                  props.setShowSideBar(false);
                }}
              >
                <LockRoundedIcon />
                <span>Login</span>
              </Link>
            </li>
          )}
          {customerId !== "" && (
            <li className={classes.nav_text}>
              <Link
                onClick={() => {
                  dispatch(AccountSliceActions.refreshData());
                  dispatch(CartSliceActions.refreshData());
                  setCookie("token", "");
                  history.push("/home");
                  props.setShowSideBar(false);
                }}
              >
                <ExitToAppIcon />
                <span>Log out</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default UserNavBar;
