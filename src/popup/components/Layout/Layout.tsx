import { useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LeftModal from "../Modal/LeftModal/LeftModal";
import Header from "./Header/Header";
import styles from "./Layout.module.css";
interface Props {}

const Layout = ({}: Props) => {
  const [actionSheetVisible, setActionSheetVisible] = useState<boolean>(false);
  const [rightHeader, renderRightHeader] = useState<React.ReactNode>(<></>);
  const [centerHeader, renderCenterHeader] = useState<React.ReactNode>("");
  const [asidePanelMainContent, renderAsidePanelMainContent] =
    useState<React.ReactNode>(<></>);
  const location = useLocation();
  const toggleSidebar = () => {
    setActionSheetVisible((v) => !v);
  };
  const onClickBackdrop = () => {
    setActionSheetVisible(false);
  };

  useLayoutEffect(() => {
    actionSheetVisible && setActionSheetVisible(false);
  }, [location]);

  return (
    <div className={styles["layout"]}>
      <div className={styles["header"]}>
        <Header
          toggleSidebar={toggleSidebar}
          renderRight={rightHeader}
          renderTitle={centerHeader}
        />
      </div>
      <div className={styles["container"]}>
        <Outlet
          context={{
            renderRightHeader,
            renderCenterHeader,
            renderAsidePanelMainContent,
          }}
        />
      </div>
      <LeftModal active={actionSheetVisible} onClickBackdrop={onClickBackdrop}>
        <div className={styles["aside-main"]}>{asidePanelMainContent}</div>
      </LeftModal>
    </div>
  );
};

export default Layout;
