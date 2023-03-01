import { useOutletContext } from "react-router-dom";

type ContextType = {
  renderRightHeader: React.Dispatch<
    React.SetStateAction<React.ReactNode>
  > | null;
  renderCenterHeader: React.Dispatch<
    React.SetStateAction<React.ReactNode>
  > | null;
  renderAsidePanelMainContent: React.Dispatch<
    React.SetStateAction<React.ReactNode>
  > | null;
};
const useHeader = () => {
  return useOutletContext<ContextType>();
};

export default useHeader;
