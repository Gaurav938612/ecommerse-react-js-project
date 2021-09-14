import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import NavBar from "./admin/components/NavBar";
import Options from "./admin/components/Options";
import AddProductForm from "./admin/pages/AddProductForm";
import Products from "./admin/pages/Products";
import ViewOrderItem from "./admin/pages/ViewOrderItem";
import ViewOrders from "./admin/pages/ViewOrders";
import { getCookie, SendRequest } from "./api/ApiRequest";
import "./App.css";
import AdminHeader from "./layout/AdminHeader";
import Header from "./layout/Header";
import NotFoundPage from "./layout/NotFoundPage";
import ProgressBar from "./layout/ProgressBar";
import UnAuthorizedPage from "./layout/UnAuthorizedPage";
import Address from "./users/component/AddressForm";
import Authentication from "./users/pages/Authentication";
import Checkout from "./users/pages/Checkout";
import Home from "./users/pages/Home";
import Logout from "./users/pages/Logout";
import MyAccount from "./users/pages/MyAccount";
import MyCart from "./users/pages/MyCart";
import { AccountSliceActions } from "./user_store/AccountSlice";
import { CartSliceActions } from "./user_store/CartSlice";

function App() {
  const dispatch = useDispatch();
  const fetchAccountData = (token) => {
    console.log("fetching account data from app page");
    SendRequest({ path: `fetchAllMyData/${token}`, method: "GET", token: token, extra: "fetchAccountData" }).then(
      (data) => {
        dispatch(AccountSliceActions.storeAccountData(data.customer));
        dispatch(AccountSliceActions.storeAddresses(data.addresses));
        dispatch(AccountSliceActions.storeOrders(data.ordersList));
        dispatch(CartSliceActions.addAllToCart(data.cartItems));
      }
    );
  };

  const loadingStatus = useSelector((state) => state.loadingStatusBar.loadingStatus);

  useEffect(() => {
    const token = getCookie("token");
    if (token !== "") {
      fetchAccountData(token);
    } else {
      dispatch({
        type: "REFRESH_DATA",
      });
    }
  }, []);
  return (
    <div>
      <div style={{ zindex: "60" }}>{loadingStatus && <ProgressBar />}</div>

      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/authenticate">
          <Header />
          <Authentication />
        </Route>

        <Route exact path="/my-cart">
          <Header />
          <MyCart />
        </Route>
        <Route exact path="/checkout">
          <Header />
          <Checkout />
        </Route>
        <Route exact path="/my-account">
          <Header />
          <MyAccount />
        </Route>
        <Route exact path="/shipping-address">
          <Header />
          <Address />
        </Route>
        <Route exact path="/admin/">
          <AdminHeader />
          <Options />
        </Route>
        <Route exact path="/admin/home">
          <AdminHeader />
          <Options />
        </Route>
        <Route exact path="/admin/view-products">
          <AdminHeader />
          <Products />
        </Route>
        <Route exact path="/admin/view-order-item">
          <AdminHeader />
          <ViewOrderItem />
        </Route>
        <Route exact path="/admin/add-product">
          <AddProductForm />
        </Route>
        <Route exact path="/admin/view-orders">
          <AdminHeader />
          <ViewOrders />
        </Route>
        <Route exact path="/logout">
          <Logout />
        </Route>
        <Route exact path="/unauthorized">
          <UnAuthorizedPage />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
