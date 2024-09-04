import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/FakeAuthContext";

export default function Login() {
  const { login, isAuthenticated, errorLogin } = useAuth();

  const navigate = useNavigate();

  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("Ahmed@example.com");
  const [password, setPassword] = useState("ahmed");

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app/cities", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  function handleLogin(e) {
    e.preventDefault();
    login(email, password);
  }

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <div>
        <button className="cta" onClick={handleLogin}>
          Login
        </button>
      </div>
      {errorLogin && (
        <div className={styles.errorContainer}>
          Incorrect user name or password
        </div>
      )}
    </form>
  );
}
