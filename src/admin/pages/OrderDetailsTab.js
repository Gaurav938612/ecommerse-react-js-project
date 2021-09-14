import Paper from "@material-ui/core/Paper";
import { StylesProvider } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import classes from "./OrderDetailsTab.module.scss";
const getImageSrc = (byteArray) => {
  var img = null;
  if (byteArray != null) img = new Buffer.from(byteArray).toString("base64");
  const file = "data:image/png;base64," + img;
  return file;
};
const OrderDetailsTab = (props) => {
  const orderDetails = props.orderDetails;
  var amount = 0;
  orderDetails.map((row) => {
    amount = amount + row.product.price * row.quantity;
  });
  return (
    <StylesProvider injectFirst>
      <TableContainer component={Paper} className={classes.container}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Line</TableCell>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">Product Name</TableCell>
              <TableCell align="center">Price (₹)</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Line Item Total ( ₹ )</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.map((row, index) => (
              <TableRow key={row.orderLinesId} hover={true}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  className={classes.image_cell}
                >
                  <img src={getImageSrc(row.product.image)} alt="img"></img>
                </TableCell>

                <TableCell align="center">{row.product.title}</TableCell>
                <TableCell align="center">{row.product.price}</TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                <TableCell align="center">
                  {row.quantity * row.product.price}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>

              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="right">Total Amount (in Rs.) :</TableCell>
              <TableCell align="center">{amount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </StylesProvider>
  );
};

export default OrderDetailsTab;
