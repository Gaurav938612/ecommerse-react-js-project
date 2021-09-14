import { Button, Card, StylesProvider, TextField } from "@material-ui/core";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getCookie, SendRequest } from "../../api/ApiRequest";
import { AccountSliceActions } from "../../user_store/AccountSlice";
import classes from "./AddressForm.module.scss";

const AddressForm = (props) => {
  const [error, setError] = useState(false);
  const history = useHistory();
  const customerId = useSelector((state) => state.account.account.customerId);
  const dispatch = useDispatch();
  const addressLine1 = useRef();
  const addressLine2 = useRef();
  const city = useRef();
  const state = useRef();
  const pinCode = useRef();
  const phNo = useRef();
  const country = useRef();
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
    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }
    if (phNo.current.value.toString().length < 10) {
      setError(true);
      return;
    } else setError(false);

    const body = {
      addressLine1: addressLine1.current.value,
      addressLine2: addressLine2.current.value,
      city: city.current.value,
      state: state.current.value,
      country: "India",
      contactNo: phNo.current.value.toString(),
      pinCode: pinCode.current.value,
      customer: {
        customerId: customerId,
      },
    };
    SendRequest({ path: "add-address", method: "POST", token: token, body: body })
      .then((value) => {
        if (value.message !== "-1") {
          props.confirmAddressHandler(parseInt(value.message));
          fetchAddress();
        } else window.alert(value.message);
      })
      .catch((error) => {
        window.alert(error);
      });
  };
  return (
    <StylesProvider injectFirst>
      <div className={classes.card}>
        <Card>
          <form onSubmit={submitHandler}>
            <div className={classes.inputField}>
              <TextField
                inputRef={addressLine1}
                margin="20"
                type="text"
                label="Address Line 1"
                placeholder="Address Line 1"
                required={true}
                className={classes.textField}
              />
              <TextField
                inputRef={addressLine2}
                type="text"
                label="Address Line 2"
                required
                placeholder="Address Line 2"
                className={classes.textField}
              />
            </div>
            <div className={classes.inputField}>
              <TextField
                inputRef={city}
                type="text"
                label="city"
                name=""
                required
                placeholder="city"
                className={classes.textField}
              />
              <TextField
                inputRef={state}
                type="text"
                label="State"
                required
                placeholder="State"
                //   variant="outlined"
                className={classes.textField}
              />
            </div>
            <div className={classes.inputField}>
              <TextField
                inputRef={phNo}
                type="number"
                required
                error={error}
                helperText={error ? "invalid phone number" : ""}
                label="contact No."
                placeholder="Contact No."
                className={classes.textField}
              />
              <TextField
                inputRef={pinCode}
                type="number"
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

export default AddressForm;
