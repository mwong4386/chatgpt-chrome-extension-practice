import styles from "./Loader.module.css";

//https://loading.io/css/
const Loader = () => {
  return (
    <div className={styles["lds-ring"]}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
