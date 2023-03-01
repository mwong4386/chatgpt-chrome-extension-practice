import Modal from "../Modal";
import styles from "./LeftModal.module.css";
interface Props {
  active: boolean;
  children?: React.ReactNode;
  onClickBackdrop?: () => void;
}

const LeftModal = ({ active, children, onClickBackdrop }: Props) => {
  return (
    <Modal
      containerClassName={`${styles["left-modal"]} ${
        active ? styles["active"] : ""
      }`}
      active={active}
      onClickBackdrop={onClickBackdrop}
    >
      {children}
    </Modal>
  );
};

export default LeftModal;
