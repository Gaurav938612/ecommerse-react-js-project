import React, { useState } from "react";
import classes from "./AddressBook.module.scss";
import { Button, Card, Paper } from "@material-ui/core";
import AddressBookForm from "./AddressBookForm";
import { useDispatch, useSelector } from "react-redux";
import AddressBookUpdateForm from "./AddressBookUpdateForm";
import { getCookie, SendRequest, SendRequestFormData } from "../../api/ApiRequest";
import { useHistory } from "react-router";
import { AccountSliceActions } from "../../user_store/AccountSlice";

const AddressBook = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const addresses = useSelector((state) => state.account.addresses);

  return (
    <div className={classes.container}>
      <Card style={{ paddingBottom: "7rem" }}>
        <div className={classes.addressesForm}>
          <Button
            style={{ margin: "1rem" }}
            variant="outlined"
            color="primary"
            onClick={() => {
              setShowAddressForm(true);
            }}
          >
            Add New Address
          </Button>

          {showAddressForm && (
            <AddressBookForm
              confirmAddressHandler={() => {
                console.log("");
              }}
              setShowAddressForm={setShowAddressForm}
            />
          )}
          <div>
            {addresses.map((item) => (
              <div className={classes.address} key={item.addressId}>
                {/* <Card style={{ padding: "1rem" }}>
                  {item.addressLine1} {item.addressLine2}, {item.city}, {item.state} -{item.pinCode}
                  <div>
                    Ph.no&nbsp; {" +91 "}
                    {item.contactNo}{" "}
                    <Button
                      color="primary"
                      onClick={() => {
                        setShowUpdateForm(true);
                      }}
                    >
                      Edit &nbsp;&nbsp;
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => {
                        deleteAddress(item.addressId);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Card> */}

                <AddressBookUpdateForm
                  item={item}
                  // confirmAddressHandler={confirmAddressHandler}
                  setShowAddressForm={setShowUpdateForm}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddressBook;
