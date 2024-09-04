import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const API_BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  errorMsg: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
        errorMsg: "",
      };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };

    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };

    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        errorMsg: action.payload,
      };

    default:
      throw new Error("Unkown the type of action in dispatch fun");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading, errorMsg }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${API_BASE_URL}/cities`);
        if (!res.ok) throw new Error();

        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (errerr) {
        dispatch({
          type: "rejected",
          payload: "Something went wrong when fetching cities",
        });
      }
    }

    fetchCities();
  }, []);

  const getCurrentCity = useCallback(
    async function getCurrentCity(id) {
      if (String(currentCity.id) === String(id)) return;
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${API_BASE_URL}/cities/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "Something went wrong when fetching the city",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${API_BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "Something went wrong when created the city",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${API_BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "Something went wrong when deleting the city ",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        isLoading,
        errorMsg,
        cities,
        currentCity,
        getCurrentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error(
      "useCities must used inside CitiesContext.provider component"
    );

  return context;
}

export { CitiesProvider, useCities };
