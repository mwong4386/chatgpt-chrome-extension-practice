import {
  Route,
  createMemoryRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Chat from "../../screens/Chat/Chat";
import ErrorPage from "../../screens/ErrorPage/ErrorPage";
import Layout from "../Layout/Layout";

const AppRouter = createMemoryRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route index element={<Chat />}></Route>
    </Route>
  )
);
export default AppRouter;
