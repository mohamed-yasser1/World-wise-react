import { useCities } from "../../contexts/CitiesContext";
import CountryItem from "../CountryItem/CountryItem";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";

import styles from "./CountryList.module.css";

function CountryList() {
  const { cities, isLoading, errorMsg } = useCities();

  if (isLoading) return <Spinner />;

  if (errorMsg)
    return <Message message="Something went wrong when fetching cities" />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const countries = cities.reduce((arr, curCity) => {
    if (!arr.map((city) => city.country).includes(curCity.country))
      return [...arr, { country: curCity.country, emoji: curCity.emoji }];

    return [...arr];
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
CountryList;
