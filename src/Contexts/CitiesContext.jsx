import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();

const BASE_URL = `http://localhost:8000`;

function reducer(state, action) {
  switch (action.type) {
    case "startLoading":
      return { ...state, isLoading: true };
    case "stopLoading":
      return { ...state, isLoading: false };
    case "cities/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "cities/loaded":
      return { ...state, cities: action.payload };
    case "cities/currentCityLoaded":
      return { ...state, currentCity: action.payload };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("Invalid action type!");
  }
}

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "startLoading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "error",
          payload: "There was an error loading data...!",
        });
      } finally {
        dispatch({ type: "stopLoading" });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      try {
        dispatch({ type: "startLoading" });
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "cities/currentCityLoaded", payload: data });
      } catch {
        dispatch({
          type: "error",
          payload: "There was an error loading data...!",
        });
      } finally {
        dispatch({ type: "stopLoading" });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: "startLoading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log(data);
      dispatch({ type: "cities/created", payload: data });
    } catch {
      dispatch({
        type: "error",
        payload: "There was an error while adding the city...!",
      });
    } finally {
      dispatch({ type: "stopLoading" });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "startLoading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      // console.log(data);
      dispatch({ type: "cities/deleted", payload: id });
    } catch {
      dispatch({
        type: "error",
        payload: "There was an error whilte deleting the city...!",
      });
    } finally {
      dispatch({ type: "stopLoading" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("useCities() used out of CitiesContext");
  return context;
}

export { CitiesProvider, useCities };
