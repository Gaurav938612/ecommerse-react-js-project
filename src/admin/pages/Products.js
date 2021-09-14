import { Button, InputBase, TablePagination } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { StylesProvider } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popups from "../../layout/Popups";
import { LoadingBarSliceActions } from "../../user_store/LoadingBarSlice";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import classes from "./Products.module.scss";


const Products = () => {
  const dispatch = useDispatch();

  console.log("redering products page..");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupForEdit, setOpenPopupForEdit] = useState(false);

  const [content, setContent] = useState({});

  const [products, setproducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchProducts = () => {
    dispatch(LoadingBarSliceActions.updateStatusBar(true));
    const promise = fetch("http://localhost:8080/view-products");
    promise
      .then((Response) => {
        return Response.json();
      })
      .then((data) => {
        setproducts(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch(LoadingBarSliceActions.updateStatusBar(false));
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const searchHandler = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };
  console.log("rendering products page....");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const account = useSelector((state) => state.account.account);
  if (account.roles === "") {
    return <div></div>;
  }
  return (
    <StylesProvider injectFirst>
      <div className={classes.addNewButtonContainer}>
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
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          onClick={() => {
            setOpenPopup(true);
          }}
        >
          Add New
        </Button>
      </div>

      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" width="80" align="center">
                Product Id
              </TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Availabe Quantity</TableCell>
              {/* <TableCell align="center">Description</TableCell> */}
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .filter((item) => {
                return String(item.title + item.category.categoryName)
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.productId}>
                  <TableCell component="th" scope="row" align="center">
                    {row.productId}
                  </TableCell>
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">
                    {row.category.categoryName}
                  </TableCell>
                  <TableCell align="center">{row.price}</TableCell>
                  <TableCell align="center">{row.inventory}</TableCell>
                  {/* <TableCell align="center">{row.description}</TableCell> */}
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.actionButton}
                  >
                    <div
                      onClick={() => {
                        setOpenPopupForEdit(true);
                        setContent({
                          productId: row.productId,
                          title: row.title,
                          category_name: row.category.categoryName,
                          price: row.price,
                          inventory: row.inventory,
                          description: row.description,
                          image: row.image,
                        });
                      }}
                    >
                      <EditOutlinedIcon color="primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Popups
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title="Add New Product"
      >
        <AddProductForm
          setOpenPopup={setOpenPopup}
          fetchProducts={fetchProducts}
        />
      </Popups>
      <Popups
        openPopup={openPopupForEdit}
        setOpenPopup={setOpenPopupForEdit}
        title="Edit Product Details"
      >
        <EditProductForm
          setOpenPopup={setOpenPopupForEdit}
          content={content}
          fetchProducts={fetchProducts}
        />
      </Popups>
    </StylesProvider>
  );
};

export default Products;
