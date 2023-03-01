import Backdrop from "../Backdrop/Backdrop";
import styles from "./Modal.module.css";
interface Props {
  active: boolean;
  children?: React.ReactNode;
  onClickBackdrop?: () => void;
  containerClassName?: string;
}

const Modal = ({
  active,
  children,
  onClickBackdrop,
  containerClassName,
}: Props) => {
  return (
    <>
      {active && <Backdrop onClick={onClickBackdrop} />}
      <div
        className={`${styles["container"]}  ${
          active ? styles["active"] : ""
        } ${containerClassName}`}
      >
        {children}
      </div>
    </>
  );
};

export default Modal;
