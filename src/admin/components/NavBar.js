import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import MenuIcon from "@material-ui/icons/Menu";
import { Link, useHistory } from "react-router-dom";
import { SidebarData } from "./SidebarData.js";
import classes from "./Navbar.module.scss";
import CloseIcon from "@material-ui/icons/Close";
import { IconContext } from "react-icons";

function NavBar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const history = useHistory();
  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className={classes.navbar}>
          <Link to="#" className={classes.menu_bars}>
            <MenuIcon onClick={showSidebar} />
          </Link>
          <div
            className={classes.heading}
            onClick={() => {
              history.replace("/admin");
            }}
          >
            <h2>E-Commerce</h2>
          </div>
        </div>
        <nav
          className={
            sidebar ? `${classes.nav_menu} ${classes.active}` : classes.nav_menu
          }
        >
          <ul className={classes.nav_menu_items} onClick={showSidebar}>
            <div className={classes.navbar_toggle}>
              <Link to="#" className={classes.menu_bars}>
                <CloseIcon />
              </Link>
            </div>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={classes.nav_text}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default NavBar;
