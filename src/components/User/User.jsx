import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/FakeAuthContext";
import styles from "./User.module.css";
import { useEffect } from "react";

function User() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(
    function () {
      if (!isAuthenticated) navigate("/");
    },
    [navigate, isAuthenticated]
  );

  function handleClick(e) {
    e.preventDefault();
    logout();
  }

  return (
    <>
      {isAuthenticated && (
        <div className={styles.user}>
          <img src={user.avatar} alt={user.name} />
          <span>Welcome, {user.name}</span>
          <button onClick={handleClick}>Logout</button>
        </div>
      )}
    </>
  );
}

export default User;
