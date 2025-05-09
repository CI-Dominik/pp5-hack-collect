import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "../styles/Asset.module.css";

// Asset showing a spinner, image or message

const Asset = ({ spinner, src, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && <Spinner animation="border" />}
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-4 text-white">{message}</p>}
    </div>
  );
};

export default Asset;