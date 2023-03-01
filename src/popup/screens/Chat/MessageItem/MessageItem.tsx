import { m_Message } from "../../../../models/m_Message";
import styles from "./MessageItem.module.css";
interface props {
  containerStyles?: React.CSSProperties;
  message: m_Message;
  onMessageClick?: (message: m_Message) => void;
}
const MessageItem = ({ message, onMessageClick, containerStyles }: props) => {
  return (
    <div
      className={styles["container"]}
      style={containerStyles}
      onClick={() => {
        onMessageClick && onMessageClick(message);
      }}
    >
      <div className={styles["messageitem-header"]}>
        <div className={styles["username"]}>{message.createdByDisplayName}</div>
      </div>
      <div className={styles["message"]}>{message.message}</div>
    </div>
  );
};

export default MessageItem;
