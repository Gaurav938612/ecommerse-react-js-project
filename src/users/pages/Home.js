import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCookie, SendRequest } from "../../api/ApiRequest";
import Header from "../../layout/Header";
import { AccountSliceActions } from "../../user_store/AccountSlice";
import { CartSliceActions } from "../../user_store/CartSlice";
import Feed from "./Feed";
const Home = () => {
  const dispatch = useDispatch();

  const fetchAccountData = (token) => {
    console.log("fetching  account data from homa page");
    SendRequest({ path: `fetchAllMyData/${token}`, method: "GET", token: token, extra: "fetchAccountData" }).then(
      (data) => {
        dispatch(AccountSliceActions.storeAccountData(data.customer));
        dispatch(AccountSliceActions.storeAddresses(data.addresses));
        dispatch(AccountSliceActions.storeOrders(data.ordersList));
        dispatch(CartSliceActions.addAllToCart(data.cartItems));
      }
    );
  };
  // const fetchCarts = (token) => {
  //   SendRequest({ path: `view-my-cart/${token}`, method: "GET", token: token }).then((data) => {
  //     console.log("success");
  //     console.log(data);
  //     if (data.length === 0) {
  //       dispatch(CartSliceActions.addAllToCart([]));
  //     } else dispatch(CartSliceActions.addAllToCart(data));
  //   });
  // };

  // const fetchAccount = (token) => {
  //   SendRequest({ path: `account/${token}`, method: "GET", token: token, extra: "fetchAccount" }).then((value) => {
  //     console.log("fetched account is", value);
  //     if (typeof value !== "undefined") {
  //       dispatch(AccountSliceActions.storeAccountData(value));
  //     }
  //   });
  // };

  useEffect(() => {
    const token = getCookie("token");
    if (token !== "") {
      // fetchAccount(token);
      // fetchCarts(token);
      fetchAccountData(token);
    } else {
      dispatch({
        type: "REFRESH_DATA",
      });
    }
  }, []);
  return (
    <div>
      <Header />
      <Feed />
    </div>
  );
};

export default Home;
