import { Card, ThemeProvider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React from "react";
import Login from "./LoginPage";
import Register from "./Register";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(40),
    width: theme.spacing(70),
    backgroundColor: theme.palette.background.paper,
  },
  label: {
    width: theme.spacing(140),
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider>
      <div className={classes.root}>
        <Card>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="simple tabs example"
            indicatorColor="primary"
          >
            <Tab label="Login" {...a11yProps(0)} className={classes.label} />
            <Tab label="Sign Up" {...a11yProps(1)} className={classes.label} />
          </Tabs>

          <TabPanel value={value} index={0}>
            <Login setValue={setValue} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Register />
          </TabPanel>
        </Card>
      </div>
    </ThemeProvider>
  );
}
