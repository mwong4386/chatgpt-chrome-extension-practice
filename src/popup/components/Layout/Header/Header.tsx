import { ReactNode } from "react";
import styles from "./Header.module.css";

interface Props {
  toggleSidebar: () => void;
  renderRight: ReactNode;
  renderTitle: ReactNode;
}
const Header = ({ toggleSidebar, renderRight, renderTitle }: Props) => {
  return (
    <div className={styles["header"]}>
      <div className={styles["header-left"]}>
        {false && (
          <button className={styles["toggle-button"]} onClick={toggleSidebar}>
            {/* <!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo Mixer Tools --> */}
            <svg
              width="16px"
              height="16px"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <g fill="#000000">
                <path d="M1 3.75A.75.75 0 011.75 3h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 3.75zM1 7.75A.75.75 0 011.75 7h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 7.75zM1.75 11a.75.75 0 000 1.5h12.5a.75.75 0 000-1.5H1.75z" />
              </g>
            </svg>
          </button>
        )}

        <div className={styles["app-name"]}>Ask the page</div>
      </div>
      <div className={styles["header-center"]}>{renderTitle}</div>
      <div className={styles["header-right"]}>{renderRight}</div>
    </div>
  );
};

export default Header;
