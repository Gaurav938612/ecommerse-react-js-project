import { Button, Card, Grid, InputBase, StylesProvider } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getCookie, SendRequest, SendRequestFormData } from "../../api/ApiRequest";
import { CartSliceActions } from "../../user_store/CartSlice";
import { CatalogActions } from "../../user_store/CatalogSlice";
import { FeedSliceActions } from "../../user_store/FeedSlice";
import CatalogComponents from "./CatalogComponents";
import classes from "./Feed.module.scss";

const getImageSrc = (byteArray) => {
  var img = null;
  if (byteArray != null) img = new Buffer.from(byteArray).toString("base64");
  const file = "data:image/png;base64," + img;
  return file;
};

const Feed = () => {
  const customerId = useSelector((state) => state.account.account.customerId);
  console.log("rendering Feed page");
  const history = useHistory();
  const products = useSelector((state) => state.feeds.items);
  const dispatch = useDispatch();
  const init = async () => {
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
      });
  };

  const fetchCarts = () => {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    SendRequest({ path: `view-my-cart/${token}`, method: "GET", token: token })
      .then((data) => {
        console.log("success");
        console.log(data);
        if (data.length === 0) {
          dispatch(CartSliceActions.addAllToCart([]));
        } else dispatch(CartSliceActions.addAllToCart(data));
      })
      .catch((error) => {
        window.alert(error);
      });
  };
  const fetchCatalog = async () => {
    SendRequest({ path: "catalogs", method: "GET" })
      .then((data) => {
        console.log(data);
        dispatch(CatalogActions.updateCatalogs(data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addToCart = async (productId, customerId, quantity) => {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("customer_id", customerId);
    formData.append("quantity", quantity);
    SendRequestFormData({ path: "manage-cart-item", method: "PUT", formData: formData, token: token })
      .then((data) => {
        console.log(data);
        if (data.message === "done") {
          fetchCarts();
        } else if (data.message === "not enough in inventory") {
          window.alert(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    init();
    fetchCatalog();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const searchHandler = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <StylesProvider injectFirst>
      <div className={classes.container}>
        <div className={classes.addButtonContainer}>
          <div className={classes.searchContainer}>
            <SearchIcon />
            <InputBase
              placeholder="Search…"
              classes={{
                input: classes.searchInput,
              }}
              onChange={searchHandler}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <CatalogComponents />
        </div>

        <Grid container>
          {products
            .filter((item) => {
              return String(item.title + item.category.categoryName)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            })
            .map((item) => (
              <Card className={classes.card} key={item.productId}>
                <div className={classes.imageBox}>
                  <img src={getImageSrc(item.image)} alt="image here" />
                </div>
                <div className={classes.title}>{item.title}</div>
                <div className={classes.price}>Price: ₹{item.price}</div>
                {/* <p className={classes.description}>{item.description}</p> */}
                <Button
                  style={{ marginTop: "1rem", textAlign: "center" }}
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    if (customerId === "") {
                      history.push("/authenticate");
                    }
                    addToCart(item.productId, customerId, 1);
                  }}
                >
                  <div>Add To Cart</div>
                </Button>
              </Card>
            ))}
        </Grid>
      </div>
    </StylesProvider>
  );
};
export default Feed;
