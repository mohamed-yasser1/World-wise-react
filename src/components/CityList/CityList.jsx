import CityItem from "../CityItem/CityItem";
import Spinner from "../Spinner/Spinner";
import Message from "../Message/Message";
import { useCities } from "../../contexts/CitiesContext";

import styles from "./CityList.module.css";

function CityList() {
  const { cities, isLoading, errorMsg } = useCities();
  if (isLoading) return <Spinner />;

  if (errorMsg) return <Message message={errorMsg} />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
