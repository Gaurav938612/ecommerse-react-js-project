import { InputBase, Tab, TablePagination, Tabs } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { StylesProvider } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getCookie, SendRequest } from "../../api/ApiRequest";
import { LoadingBarSliceActions } from "../../user_store/LoadingBarSlice";
import classes from "./ViewOrders.module.scss";

const filterFunction = (row, index) => {
  if (index === 0) return true;
  else if (index === 1) return row.status === "PLACED";
  else if (index === 2) return row.status === "CONFIRMED";
  else if (index === 3) return row.status === "SHIPPED";
  else if (index === 4) return row.status === "CANCELLED";
  else return false;
};

const ViewOrders = () => {
  const initialSize = {
    ALL: 0,
    PLACED: 0,
    CONFIRMED: 0,
    SHIPPED: 0,
    CANCELLED: 0,
  };
  const [orders, setOrders] = useState([]);
  orders.sort(function (a, b) {
    return Date.parse(b.date) - Date.parse(a.date);
  });
  initialSize["ALL"] = orders.length;
  for (var i = 0; i < orders.length; i++) {
    initialSize[orders[i].status]++;
  }

  const history = useHistory();
  const dispatch = useDispatch();
  const handleCellClick = (row) => {
    history.push(`/admin/view-order-item?orderId=${row.orderId}`);
  };

  function fetchOrders() {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    SendRequest({ path: "admin/view-all-orders", method: "GET", token: token })
      .then((data) => {
        console.log(data);
        setOrders(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchOrders();
  }, []);
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
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(initialSize);

  const [searchTerm, setSearchTerm] = useState("");
  const searchHandler = (event) => {
    setSearchTerm(event.target.value);
  };
  if (account.roles === "") {
    return <div></div>;
  }
  return (
    <StylesProvider injectFirst>
      <div className={classes.rootContainer}>
        <div className={classes.addButtonContainer}>
          <Tabs className={classes.tabs}>
            <Tab
              label={"All(" + initialSize.ALL + ")"}
              className={classes.tab}
              onClick={() => {
                setIndex(0);
              }}
              style={index === 0 ? { textTransform: "none", backgroundColor: "#e4e4e5" } : { textTransform: "none" }}
            />
            <Tab
              label={"Placed(" + initialSize.PLACED + ")"}
              onClick={() => {
                setIndex(1);
              }}
              className={classes.tab}
              style={index === 1 ? { textTransform: "none", backgroundColor: "#e4e4e5" } : { textTransform: "none" }}
            />
            <Tab
              label={"Confirmed(" + initialSize.CONFIRMED + ")"}
              onClick={() => {
                setIndex(2);
              }}
              className={classes.tab}
              style={index === 2 ? { textTransform: "none", backgroundColor: "#e4e4e5" } : { textTransform: "none" }}
            />
            <Tab
              label={"Shipped(" + initialSize.SHIPPED + ")"}
              onClick={() => {
                setIndex(3);
              }}
              className={classes.tab}
              style={index === 3 ? { textTransform: "none", backgroundColor: "#e4e4e5" } : { textTransform: "none" }}
            />
            <Tab
              label={"Cancelled(" + initialSize.CANCELLED + ")"}
              onClick={() => {
                setIndex(4);
              }}
              className={classes.tab}
              style={index === 4 ? { textTransform: "none", backgroundColor: "#e4e4e5" } : { textTransform: "none" }}
            />
          </Tabs>
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
        </div>
        <TableContainer component={Paper} className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ minWidth: "6rem" }}>
                  Order Id
                </TableCell>
                <TableCell align="center" style={{ minWidth: "6rem" }}>
                  First Name
                </TableCell>
                <TableCell align="center" style={{ minWidth: "6rem" }}>
                  Last Name
                </TableCell>
                <TableCell align="center" style={{ minWidth: "6rem" }}>
                  Status
                </TableCell>
                <TableCell align="center" style={{ minWidth: "6rem" }}>
                  Payment Type
                </TableCell>
                <TableCell align="center" style={{ minWidth: "8rem", overflow: "hidden" }}>
                  Address Line 1
                </TableCell>
                <TableCell align="center" style={{ minWidth: "6rem" }}>
                  Address Line 2
                </TableCell>
                <TableCell align="center" style={{ minWidth: "6rem" }}>
                  City
                </TableCell>
                <TableCell align="center" style={{ minWidth: "6rem" }}>
                  State
                </TableCell>
                <TableCell align="center" style={{ minWidth: "6rem" }}>
                  PIN code
                </TableCell>

                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .filter((item) => {
                  return String(item.shipmentAddress.customer.firstName + item.shipmentAddress.customer.lastName + item.status)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                })
                .filter((item) => {
                  return filterFunction(item, index);
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.productId} hover={true}>
                    <TableCell component="th" scope="row" align="center" onDoubleClick={handleCellClick}>
                      {row.orderId}
                    </TableCell>
                    <TableCell
                      align="center"
                      onDoubleClick={() => {
                        handleCellClick(row);
                      }}
                    >
                      {row.shipmentAddress.customer.firstName}
                    </TableCell>
                    <TableCell
                      align="center"
                      onDoubleClick={() => {
                        handleCellClick(row);
                      }}
                    >
                      {row.shipmentAddress.customer.lastName}
                    </TableCell>
                    <TableCell
                      align="center"
                      onDoubleClick={() => {
                        handleCellClick(row);
                      }}
                    >
                      {row.status}
                    </TableCell>
                    <TableCell
                      align="center"
                      onDoubleClick={() => {
                        handleCellClick(row);
                      }}
                    >
                      {row.paymentType}
                    </TableCell>
                    <TableCell
                      align="center"
                      onDoubleClick={() => {
                        handleCellClick(row);
                      }}
                    >
                      {row.shipmentAddress.addressLine1}
                    </TableCell>
                    <TableCell
                      align="center"
                      onDoubleClick={() => {
                        handleCellClick(row);
                      }}
                    >
                      {row.shipmentAddress.addressLine2}
                    </TableCell>
                    <TableCell
                      align="center"
                      onDoubleClick={() => {
                        handleCellClick(row);
                      }}
                    >
                      {row.shipmentAddress.city}
                    </TableCell>
                    <TableCell
                      align="center"
                      onDoubleClick={() => {
                        handleCellClick(row);
                      }}
                    >
                      {row.shipmentAddress.state}
                    </TableCell>
                    <TableCell
                      align="center"
                      onDoubleClick={() => {
                        handleCellClick(row);
                      }}
                    >
                      {row.shipmentAddress.pinCode}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {/* <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </TableContainer>
      </div>
    </StylesProvider>
  );
};

export default ViewOrders;
