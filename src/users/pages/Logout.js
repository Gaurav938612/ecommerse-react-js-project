import { Button } from "@material-ui/core";
import { useHistory } from "react-router";
import classes from "./Logout.module.scss";
const Logout = () => {
  const history = useHistory();

  return (
    <div className={classes.container}>
      <h2 className={classes.message}>Successfully logged out</h2>
      <Button
        color="primary"
        variant="outlined"
        onClick={() => {
          history.replace("./home");
        }}
      >
        Go to home page
      </Button>
    </div>
  );
};

export default Logout;
