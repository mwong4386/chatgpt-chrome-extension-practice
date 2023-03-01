import { Link } from "react-router-dom";

interface props {
  isLogin: boolean;
  isLoading: boolean;
  user: any;
  signIn: () => void;
  signOut: () => void;
}
const AsideUserInfo = ({
  isLogin,
  isLoading,
  user,
  signIn,
  signOut,
}: props) => {
  if (isLoading) return <div>loading...</div>;
  if (!isLogin)
    return (
      <div>
        <button onClick={signIn}>Sign In with Google</button>
      </div>
    );
  return (
    <>
      <div>Hi, {user?.displayName}</div>
      <div>
        <Link to="/profile">See your Profile</Link>
      </div>
      <button onClick={signOut}>Sign out</button>
    </>
  );
};

export default AsideUserInfo;
