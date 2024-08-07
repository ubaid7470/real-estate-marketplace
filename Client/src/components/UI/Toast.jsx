import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { closeToast } from "../../redux/toast/toastSlice";

export default function Toast() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.toast);
  const vertical = "top";
  const horizontal = "center";

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeToast());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={7000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
      key={vertical + horizontal}
      className="mt-5"
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
