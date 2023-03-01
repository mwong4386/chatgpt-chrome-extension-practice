import Modal from "../Modal";
import styles from "./BottomModal.module.css";
interface Props {
  active: boolean;
  children?: React.ReactNode;
  onClickBackdrop?: () => void;
}

const BottomModal = ({ active, children, onClickBackdrop }: Props) => {
  return (
    <Modal
      containerClassName={`${styles["bottom-modal"]} ${
        active ? styles["active"] : ""
      }`}
      active={active}
      onClickBackdrop={onClickBackdrop}
    >
      {children}
    </Modal>
  );
};

export default BottomModal;
