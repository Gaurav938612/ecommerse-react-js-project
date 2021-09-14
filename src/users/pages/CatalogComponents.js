import {
  Button,
  Grid,
  Menu,
  MenuItem,
  StylesProvider
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FeedSliceActions } from "../../user_store/FeedSlice";
import classes from "./CatalogComponents.module.scss";
const CatalogComponents = () => {
  const catalogs = useSelector((state) => state.catalog.items);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorE1] = useState(null);
  const onClose = (event) => {
    setAnchorE1(null);
  };
  const onOpen = (event) => {
    setAnchorE1(event.currentTarget);
  };
  const fetchAllProducts = async () => {
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
  const filterProducts = (id) => {
    fetch(`http://localhost:8080/view-products-by-category/${id}`, {
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
  console.log("rendering Catalog components");
  return (
    <StylesProvider injectFirst>
      <div className={classes.category}>
        <Button variant="outlined" onClick={onOpen} className={classes.button}>
          Choose Category
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={onClose}
        >
          <Grid item xs={2}>
            <MenuItem
              className={classes.catalog}
              onClick={() => {
                fetchAllProducts();
                onClose();
              }}
            >
              All
            </MenuItem>
            {catalogs.map((item) => (
              <MenuItem
                className={classes.catalog}
                onClick={() => {
                  filterProducts(item.categoryId);
                  onClose();
                }}
              >
                {item.categoryName}
              </MenuItem>
            ))}
          </Grid>
        </Menu>
      </div>
    </StylesProvider>
  );
};
//
export default CatalogComponents;
