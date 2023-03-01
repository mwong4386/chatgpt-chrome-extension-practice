import { RouterProvider } from "react-router-dom";
import AppRouter from "./components/AppNavigator/AppNavigator";

const App = () => {
  return <RouterProvider router={AppRouter} />;
};

export default App;
