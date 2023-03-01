import styles from "./Backdrop.module.css";
interface Props {
  onClick?: () => void;
}
const Backdrop = ({ onClick }: Props) => {
  return <div className={styles["backdrop"]} onClick={onClick}></div>;
};

export default Backdrop;
