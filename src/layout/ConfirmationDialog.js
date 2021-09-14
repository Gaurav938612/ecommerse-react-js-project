import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  makeStyles
} from "@material-ui/core";
const useStyle = makeStyles((theme) => ({
  ActionDialogTitle: {
    marginTop: theme.spacing(4),
  },
  ActionButton: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    // paddingBottom: theme.spacing(3),
  },
}));
const ConfirmationDialog = (props) => {
  const classes = useStyle();
  const handleOk = () => {};
  return (
    <div>
      <Dialog
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={props.open}
        className={classes.ActionDialog}
      >
        <DialogTitle
          id="confirmation-dialog-title"
          className={classes.ActionDialogTitle}
        >
          {props.children}
        </DialogTitle>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              props.onClose();
            }}
            variant="outlined"
            color={props.color_cancel}
            className={classes.ActionButton}
          >
            {props.cancel}
          </Button>
          <Button
            onClick={handleOk}
            variant="outlined"
            onClick={() => {
              props.handleAction();
            }}
            color={props.color_ok}
            className={classes.ActionButton}
          >
            {props.ok}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ConfirmationDialog;
