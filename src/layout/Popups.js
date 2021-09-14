import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { useHistory } from "react-router";

const useStyle = makeStyles((theme) => ({
  dialogAction: {
    paddingRight: theme.spacing(20),
    paddingBottom: theme.spacing(3),
  },
}));
export default function Popups(props) {
  const classes = useStyle();
  const history = useHistory();
  const { openPopup, setOpenPopup, title, children } = props;

  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <div>
      <Dialog
        open={openPopup}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
      >
        {title != null && (
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        )}
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </div>
  );
}
