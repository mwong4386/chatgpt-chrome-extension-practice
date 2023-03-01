import styles from "./TitleWithTooltip.module.css";

interface props {
  children: React.ReactNode;
}
const TitleWithTooltip = ({ children }: props) => {
  return (
    <>
      <div className={styles["header-title"]}>{children}</div>
      <div className={styles["tooltip"]}>{children}</div>
    </>
  );
};

export default TitleWithTooltip;
