import { Button, Card, Grid, MenuItem, Select, StylesProvider, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import HighlightOffSharpIcon from "@material-ui/icons/HighlightOffSharp";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getCookie, getImageSrc, SendRequest, SendRequestFormData } from "../../api/ApiRequest";
import classes from "./EditProductForm.module.scss";

var next_step = "";
const EditProductForm = (props) => {
  console.log(props);
  const byteArray = props.content.image;
  var img = null;
  if (byteArray != null) img = new Buffer.from(props.content.image).toString("base64");

  const { setOpenPopup } = props;
  const initialValues = {
    productId: props.content.productId,
    title: props.content.title,
    price: props.content.price,
    description: props.content.description,
    inventory: props.content.inventory,
    category_name: props.content.category_name,
    other_category: "",
    image: props.content.image,
    file: getImageSrc(props.content.image),
    new_img: false,
  };
  const history = useHistory();

  const [catalogs, setCatalogs] = useState([]);

  const [values, setValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => {
      return {
        ...prev,
        [name]: value,
        ["image"]: prev.image,
      };
    });
  };
  const handleImageChange = (event) => {
    try {
      setValues({
        ...values,
        ["image"]: event.target.files[0],
        ["file"]: URL.createObjectURL(event.target.files[0]),
        ["new_img"]: true,
      });
    } catch (error) {}
  };
  const removeImage = (event) => {
    setValues({
      ...values,
      ["image"]: null,
      ["file"]: null,
      ["new_img"]: true,
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
    formData.append("productId", values.productId);
    formData.append("image", values.image);
    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("inventory", values.inventory);
    if (values.category_name === "Other") formData.append("category_name", values.other_category);
    else formData.append("category_name", values.category_name);
    console.log(formData);
    const path = values.new_img ? "admin/update-product" : "admin/update-product-without-img";
    SendRequestFormData({ path: path, method: "PUT", formData: formData, token: token })
      .then((value) => {
        console.log(value);
        next_step = "exit";
        setShowAlert({
          message: "Product Updated successfully",
          status: true,
        });
        props.fetchProducts();
      })
      .catch((error) => {
        console.log(error);
        setShowAlert({ message: error, status: true });
      });
  };
  console.log("rendering Edit ProductForm Page");
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
        <DialogTitle style={{ padding: "2rem" }}>{showAlert.message}</DialogTitle>
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
              value={values.inventory}
              className={classes.inputField}
              onChange={handleInputChange}
            />
            <div className={classes.image}>
              <label>Upload Image</label>
              <input
                type="file"
                id="myFile"
                name="image"
                // value={values.image}
                accept=".png, .jpg, .jpeg"
                onChange={handleImageChange}
              ></input>
            </div>
            {values.image != null && (
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
                value={values.description}
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
              value={values.price}
              className={classes.inputField}
              onChange={handleInputChange}
            />
            <div className={classes.dropdown}>
              <p>Category *</p>
              <Select
                fullWidth
                labelId="demo-simple-select-filled-label"
                onChange={handleInputChange}
                style={{ textTransform: "capitalize" }}
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
                    props.setOpenPopup(false);
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
      {/* <Popups
        openPopup={openDialog}
        setOpenPopup={setOpenDialog}
        // title="Product Update"
        nextStep={() => {
          setOpenPopup(false);
        }}
      >
        <div className={classes.successMsg} style={{ padding: "1rem" }}>
          <h3>Product Updated successfully</h3>
          
        </div>
      </Popups> */}
    </StylesProvider>
  );
};

export default EditProductForm;
