import { Button, Card, StylesProvider, TextField } from "@material-ui/core";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getCookie, SendRequest } from "../../api/ApiRequest";
import { AccountSliceActions } from "../../user_store/AccountSlice";
import classes from "./AddressForm.module.scss";

const UpdateAddressForm = (props) => {
  const initialValues = {
    addressLine1: props.item.addressLine1,
    addressLine2: props.item.addressLine2,
    city: props.item.city,
    state: props.item.state,
    pinCode: props.item.pinCode,
    contactNo: props.item.contactNo,
  };
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(false);
  const history = useHistory();

  const customerId = useSelector((state) => state.account.account.customerId);
  const dispatch = useDispatch();
  const addressId = props.item.addressId;
  const addressLine1Ref = useRef();
  const addressLine2Ref = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const pinCodeRef = useRef();
  const phNoRef = useRef();

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const fetchAddress = () => {
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    SendRequest({ path: `fetch-address/${token}`, method: "GET", token: token })
      .then((data) => {
        console.log("fetched address", data);
        if (data.length === 0) {
          return;
        }
        dispatch(AccountSliceActions.storeAddresses(data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const submitHandler = (event) => {
    event.preventDefault();
    if (phNoRef.current.value.toString().length < 10) {
      setError(true);
      return;
    } else setError(false);
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }

    const body = {
      addressId: addressId,
      addressLine1: addressLine1Ref.current.value,
      addressLine2: addressLine2Ref.current.value,
      city: cityRef.current.value,
      state: stateRef.current.value,
      country: "India",
      contactNo: phNoRef.current.value.toString(),
      pinCode: pinCodeRef.current.value,
      customer: {
        customerId: customerId,
      },
    };
    SendRequest({ path: "update-address", method: "PUT", body: body, token: token })
      .then((value) => {
        if (value.message !== "-1") {
          console.log("address saved with id", value.message);
          props.confirmAddressHandler(parseInt(value.message));
          fetchAddress();
        } else window.confirm(value.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <StylesProvider injectFirst>
      <div className={classes.card}>
        <Card>
          <form onSubmit={submitHandler}>
            <div className={classes.inputField}>
              <TextField
                inputRef={addressLine1Ref}
                margin="20"
                name="addressLine1"
                value={values.addressLine1}
                type="text"
                label="Address Line 1"
                placeholder="Address Line 1"
                required={true}
                onChange={changeHandler}
                className={classes.textField}
              />
              <TextField
                inputRef={addressLine2Ref}
                type="text"
                name="addressLine2"
                label="Address Line 2"
                value={values.addressLine2}
                onChange={changeHandler}
                required
                placeholder="Address Line 2"
                className={classes.textField}
              />
            </div>
            <div className={classes.inputField}>
              <TextField
                inputRef={cityRef}
                value={values.city}
                type="text"
                onChange={changeHandler}
                label="city"
                name="city"
                required
                placeholder="city"
                className={classes.textField}
              />
              <TextField
                inputRef={stateRef}
                type="text"
                value={values.state}
                onChange={changeHandler}
                label="State"
                name="state"
                required
                placeholder="State"
                //   variant="outlined"
                className={classes.textField}
              />
            </div>
            <div className={classes.inputField}>
              <TextField
                inputRef={phNoRef}
                type="number"
                name="contactNo"
                value={values.contactNo}
                onChange={changeHandler}
                required
                error={error}
                helperText={error ? "invalid phone number" : ""}
                label="contact No."
                placeholder="Contact No."
                className={classes.textField}
              />
            </div>
            <div className={classes.inputField}>
              <TextField
                inputRef={pinCodeRef}
                type="number"
                name="pinCode"
                value={values.pinCode}
                onChange={changeHandler}
                required
                label="Pin Code"
                placeholder="Pin Code"
                className={classes.textField}
              />
            </div>

            <div className={classes.manageButton}>
              <div
                onClick={() => {
                  props.setShowAddressForm(false);
                }}
              >
                <Button>Cancel</Button>
              </div>
              <div className={classes.submitField} onClick={submitHandler}>
                Save and Deliver Here
              </div>
            </div>
          </form>
        </Card>
      </div>
    </StylesProvider>
  );
};

export default UpdateAddressForm;
