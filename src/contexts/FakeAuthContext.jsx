import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Ahmed",
  email: "Ahmed@example.com",
  password: "ahmed",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const initialState = {
  isAuthenticated: false,
  user: null,
  // For Error Msg
  errorLogin: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "errLogin":
      return {
        //  spread the state beacuse if we add a new features
        ...state,
        errorLogin: true,
      };

    case "login":
      return {
        //  spread the state beacuse if we add a new features
        ...state,
        isAuthenticated: true,
        user: action.payload,
        errorLogin: false,
      };

    case "logout":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      throw new Error("Unkown the type of action in dispatch state function");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, errorLogin }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      return dispatch({ type: "login", payload: FAKE_USER });

    if (email !== FAKE_USER.email || password !== FAKE_USER.password)
      return dispatch({ type: "errLogin" });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        errorLogin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  // console.log(context);
  if (context === undefined)
    throw new Error("UseAuth used outside AuthContext.Provider");

  return context;
}

export { AuthProvider, useAuth };
