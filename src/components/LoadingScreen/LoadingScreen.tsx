import styles from "./LoadingScreen.module.css";
import Loader from "../Loader/Loader";
const LoadingScreen = () => {
  return (
    <div className={styles["center"]}>
      <Loader />
    </div>
  );
};

export default LoadingScreen;
