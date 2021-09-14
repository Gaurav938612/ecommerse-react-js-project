import { Button, Card, Grid, MenuItem, Select, StylesProvider, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import HighlightOffSharpIcon from "@material-ui/icons/HighlightOffSharp";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { getCookie, SendRequest, SendRequestFormData } from "../../api/ApiRequest";
import classes from "./AddProductForm.module.scss";

const initialValues = {
  title: "",
  price: "",
  description: "",
  inventory: "",
  category_name: "",
  other_category: "",
  file: null,
};
var next_step = "";
const AddProductForm = (props) => {
  const { setOpenPopup } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const [catalogs, setCatalogs] = useState([]);

  const [values, setValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleImageChange = (event) => {
    try {
      setValues({
        ...values,
        ["image"]: event.target.files[0],
        ["file"]: URL.createObjectURL(event.target.files[0]),
      });
    } catch (error) {}
  };
  const removeImage = (event) => {
    setValues({
      ...values,
      ["image"]: null,
      ["file"]: null,
    });
    var field = document.getElementById("myFile");
    field.value = field.defaultValue;
  };
  const submitHandler = (event) => {
    event.preventDefault();

    const token = getCookie("token");
    if (token === "") {
      window.alert("please login first");
      history.push("/authenticate");
      return;
    }

    const formData = new FormData();
    formData.append("image", values.image);
    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("inventory", values.inventory);
    if (values.category_name === "Other") formData.append("category_name", values.other_category);
    else formData.append("category_name", values.category_name);
    console.log(formData);
    SendRequestFormData({ path: "admin/add-new-product", method: "POST", formData: formData, token: token })
      .then((value) => {
        next_step = "exit";
        setShowAlert({ message: "Product Added Successfully", status: true });
        props.fetchProducts();
      })
      .catch((error) => {
        console.log(error);
        setShowAlert({ message: "failed to connect", status: true });
      });
  };
  function fetchCatalogs() {
    SendRequest({ path: "catalogs", method: "GET" })
      .then((data) => {
        setCatalogs(data);
      })
      .catch((error) => {
        console.log(error);
        setShowAlert({ message: error.message, status: true });
      });
  }
  useEffect(() => {
    fetchCatalogs();
  }, []);
  const [showAlert, setShowAlert] = useState({ message: "", status: false });
  return (
    <StylesProvider injectFirst>
      <Dialog
        open={showAlert.status}
        onClose={() => {
          setShowAlert({ message: "", status: false });
          if (next_step === "exit") setOpenPopup(false);
        }}
      >
        <DialogTitle>{showAlert.message}</DialogTitle>
      </Dialog>
      <form className={classes.container} onSubmit={submitHandler}>
        <Grid container>
          <Grid item xs={6}>
            <TextField
              required
              id="title"
              name="title"
              value={values.title}
              label="Product Name"
              className={classes.inputField}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="inventory"
              label="Available Quantity"
              type="number"
              className={classes.inputField}
              onChange={handleInputChange}
            />
            <div className={classes.image}>
              <label>Upload Image</label>
              <input
                type="file"
                id="myFile"
                name="image"
                accept=".png, .jpg, .jpeg"
                onChange={handleImageChange}
              ></input>
            </div>
            {values.file != null && (
              <div className={classes.imageBox}>
                <Card className={classes.imageCard}>
                  <img src={values.file} alt="preview" />
                  <span onClick={removeImage}>
                    <HighlightOffSharpIcon />
                  </span>
                </Card>
              </div>
            )}

            <div className={classes.textarea}>
              {/* <label>Description *</label>
              <TextareaAutosize
                name="description"
                required
                className={classes.textarea2}
                minRows={5}
                placeholder="Add Description"
                onChange={handleInputChange}
              /> */}
            </div>
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              name="price"
              label="price"
              type="number"
              className={classes.inputField}
              onChange={handleInputChange}
              style={{ textTransform: "capitalize" }}
            />
            <div className={classes.dropdown}>
              <p>Category *</p>
              <Select
                fullWidth
                labelId="demo-simple-select-filled-label"
                onChange={handleInputChange}
                inputProps={{
                  name: "category_name",
                  value: values.category_name,
                }}
              >
                <MenuItem value="Other">Other</MenuItem>
                {catalogs.map((item) => (
                  <MenuItem value={item.categoryName} className={classes.categoryName}>
                    {item.categoryName}
                  </MenuItem>
                ))}
              </Select>
              {values.category_name === "Other" && (
                <TextField
                  required
                  label="category"
                  type="text"
                  name="other_category"
                  className={classes.inputField}
                  onChange={handleInputChange}
                />
              )}
              <div className={classes.button}>
                <Button
                  variant="outlined"
                  color="#000"
                  onClick={() => {
                    setOpenPopup(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </form>
    </StylesProvider>
  );
};

export default AddProductForm;
