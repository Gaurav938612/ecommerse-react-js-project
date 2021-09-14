import { Button, Dialog, DialogTitle, Grid, StylesProvider, TextField } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router";
import { SendRequest } from "../../api/ApiRequest";
import classes from "./Register.module.scss";

const initialValue = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phNo: "",
  password2: "",
};

var next_step = "";
const Register = () => {
  const history = useHistory();
  console.log("register components rendering...");
  const [details, setDeatils] = useState(initialValue);
  const [passError, setPassError] = useState(false);

  const [showAlert, setShowAlert] = useState({ message: "", status: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      if (value !== details.password2) setPassError(true);
      else setPassError(false);
    }
    if (name === "password2") {
      if (value !== details.password) setPassError(true);
      else setPassError(false);
    }
    setDeatils({
      ...details,
      [name]: value,
    });
  };
  const submitHandler = (event) => {
    event.preventDefault();
    if (details.password !== details.password2) {
      setPassError(true);
      return;
    }
    const body = {
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      password: details.password,
      phNo: details.phNo,
    };
    SendRequest({ path: "sign-up", method: "POST", body: body, token: "" })
      .then((data) => {
        if (data.message === "done") {
          next_step = "exit";
          setShowAlert({ message: "Registered Successfully", status: true });
        } else {
          setShowAlert({ message: data.message, status: true });
        }
      })
      .catch((error) => {
        window.alert(error);
      });
  };
  return (
    <StylesProvider injectFirst>
      <div className={classes.card}>
        <form onSubmit={submitHandler}>
          <Grid container>
            <Grid xs={6}>
              <TextField
                margin="20"
                type="text"
                label="First Name"
                placeholder="First Name"
                name="firstName"
                value={details.firstName}
                required={true}
                onChange={handleInputChange}
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="text"
                label="Last Name"
                name="lastName"
                value={details.lastName}
                required
                onChange={handleInputChange}
                placeholder="Last Name"
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="email"
                label="Email"
                name="email"
                value={details.email}
                onChange={handleInputChange}
                required
                placeholder="Email"
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Contact number"
                name="phNo"
                value={details.phNo}
                placeholder="Contact No."
                onChange={handleInputChange}
                //   variant="outlined"
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="password"
                required
                label="Password"
                name="password"
                value={details.password}
                placeholder="Password"
                onChange={handleInputChange}
                className={classes.textField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="password"
                required
                name="password2"
                value={details.password2}
                label="Confirm Password"
                onChange={handleInputChange}
                placeholder="Password"
                helperText={passError ? "Password must be same" : ""}
                error={passError}
                className={classes.textField}
              />
            </Grid>
          </Grid>

          <div className={classes.submitField}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              style={{
                backgroundColor: "cadetblue",
                textTransform: "none",
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              Register
            </Button>
          </div>
        </form>
      </div>
      <Dialog
        open={showAlert.status}
        onClose={() => {
          setShowAlert({ message: "", status: false });
          if (next_step === "exit") history.push("/home");
        }}
      >
        <DialogTitle>{showAlert.message}</DialogTitle>
      </Dialog>
    </StylesProvider>
  );
};

export default Register;
