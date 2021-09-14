import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarData } from "../../admin/components/SidebarData";
import classes from "./Navbar.module.scss";

function NavBar() {
  console.log("rendering NavBar page");
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className={classes.navbar}>
        <Link to="#" className={classes.menu_bars}>
          <MenuIcon onClick={showSidebar} />
        </Link>
        <div className={classes.heading}>
          <h2>E-Commerce</h2>
        </div>
      </div>
      <nav
        className={
          sidebar ? `${classes.nav_menu} ${classes.active}` : classes.nav_menu
        }
      >
        <ul className={classes.nav_menu_items} onClick={showSidebar}>
          <li className={classes.navbar_toggle}>
            <Link to="#" className={classes.menu_bars}>
              <CloseIcon />
            </Link>
          </li>
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
    </>
  );
}

export default NavBar;
