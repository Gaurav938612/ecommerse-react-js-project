import { Button, Card, StylesProvider } from "@material-ui/core";
import { useState } from "react";
import classes from "./AddressCard.module.scss";
import UpdateAddressForm from "./UpdateAddressForm";
const AddressCard = (props) => {
  const [updateAddress, setUpdateAddress] = useState(false);

  const confirmAddressHandler = (id) => {
    props.confirmAddressHandler(id);
  };
  const setShowAddressForm = (id) => {
    setUpdateAddress(false);
  };

  return (
    <StylesProvider injectFirst>
      <Card>
        <div className={classes.address}>
          {props.item.addressLine1} {props.item.addressLine2}, {props.item.city}, {props.item.state} -
          {props.item.pinCode}
          <div>
            Ph.no&nbsp; {" +91 "}
            {props.item.contactNo}{" "}
            <Button
              color="primary"
              onClick={() => {
                props.confirmAddressHandler(props.item.addressId);
              }}
            >
              Deliver Here&nbsp;&nbsp;
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                setUpdateAddress(true);
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>
      {updateAddress && (
        <UpdateAddressForm
          item={props.item}
          confirmAddressHandler={confirmAddressHandler}
          setShowAddressForm={setShowAddressForm}
        />
      )}
    </StylesProvider>
  );
};

export default AddressCard;
