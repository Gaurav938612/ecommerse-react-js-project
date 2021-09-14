import { Link } from "react-router-dom";
import classes from "./OptionItem.module.scss";
const OptionItem = (props) => {
  return (
    <div className={classes.cards}>
      <Link to={props.link}>
        <h2 className={classes.text}>{props.text}</h2>
      </Link>
    </div>
  );
};
export default OptionItem;
