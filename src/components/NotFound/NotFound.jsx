import React from "react";
import styles from "./NotFound.module.css";
import Navbar from "../Navbar/Navbar";

function NotFound() {
  return (
    <>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.notFound}>NotFound</div>
      </main>
    </>
  );
}

export default NotFound;
