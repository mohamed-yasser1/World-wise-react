import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

import styles1 from "../../pages/HomePage/Homepage.module.css";
import styles2 from "../../pages/Product/Product.module.css";
import styles3 from "../../pages/Login/Login.module.css";
import Spinner from "../Spinner/Spinner";

function Layout() {
  const location = useLocation().pathname;

  let pageStyle;

  function setPagetStyle() {
    if (location === "/") pageStyle = styles1.homepage;
    if (location === "/product" || location === "/pricing")
      pageStyle = styles2.product;
    if (location === "/login") pageStyle = styles3.login;
  }

  setPagetStyle();

  return (
    <main className={pageStyle}>
      <Navbar />
      <Outlet />
    </main>
  );
}

export default Layout;
