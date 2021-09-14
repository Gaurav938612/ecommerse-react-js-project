import { Button, StylesProvider, TextField } from "@material-ui/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { SendRequest, setCookie } from "../../api/ApiRequest";
import classes from "./LoginPage.module.scss";

const initialValue = {
  email: "",
  password: "",
};
const initialError = {
  email: false,
  password: false,
};
const Login = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [values, setValues] = useState(initialValue);
  const [error, setError] = useState(initialValue);
  const changeHandler = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const body = {
      email: values.email,
      password: values.password,
    };
    SendRequest({ path: "login", method: "POST", body: body })
      .then((data) => {
        if (typeof data === "undefined") return;
        if (data.message === "done") {
          setCookie("token", data.token);
          history.replace("/home");
        } else if (data.message === "invalid") {
          setError((prev) => {
            return {
              email: false,
              password: true,
            };
          });
        }
      })
      .catch((error) => {
        window.alert(error);
      });
  };
  return (
    <StylesProvider injectFirst>
      <form onSubmit={submitHandler}>
        <div className={classes.card}>
          <TextField
            type="email"
            label="Email"
            name="email"
            value={values.email}
            placeholder="Placeholder"
            error={error.email}
            helperText={error.email ? "Email not registered " : ""}
            onChange={changeHandler}
            className={classes.textField}
          />
          <TextField
            type="password"
            label="Password"
            name="password"
            value={values.password}
            placeholder="Placeholder"
            error={error.password}
            helperText={error.password ? "invalid credentials" : ""}
            onChange={changeHandler}
            className={classes.textField}
          />
          <div className={classes.loginButton}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "cadetblue",
                textTransform: "none",
                width: "30%",
                color: "white",
                fontSize: "1rem",
              }}
              size="medium"
              type="submit"
            >
              Login
            </Button>
          </div>
          <div className={classes.footer}>
            <Button
              color="primary"
              classes={{ label: classes.button }}
              onClick={() => {
                props.setValue(1);
              }}
            >
              New to Website? Create an Account
            </Button>
          </div>
        </div>
      </form>
    </StylesProvider>
  );
};

export default Login;
