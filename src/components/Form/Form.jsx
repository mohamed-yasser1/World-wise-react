// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Button from "../Button/Button";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";
import useUrlPosition from "../../hooks/useUrlPosition";

import styles from "./Form.module.css";
import { useCities } from "../../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const API_BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const navigate = useNavigate();
  const { createCity, isLoading } = useCities();

  const [lat, lng] = useUrlPosition();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingCityFetch, setIsLoadingCityFetch] = useState(false);
  const [errorCityFetch, setErrorCityFetch] = useState("");

  useEffect(
    function () {
      if (!lat && !lng) return;

      async function fetchCityData() {
        try {
          setIsLoadingCityFetch(true);
          setErrorCityFetch("");
          const res = await fetch(
            `${API_BASE_URL}?latitude=${lat}&longitude=${lng}`
          );

          if (!res.ok) throw new Error("Faild to fetch data");

          const cityData = await res.json();

          if (!cityData.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else"
            );

          setCityName(cityData.city || cityData.locality);
          setCountry(cityData.countryName);
          setEmoji(convertToEmoji(cityData.countryCode));
        } catch ({ message }) {
          setErrorCityFetch(message);
        } finally {
          setIsLoadingCityFetch(false);
        }
      }

      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName && !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };

    await createCity(newCity);
    navigate("/app/cities");
  }

  if ((!lat, !lng))
    return <Message message="Start by clicking somewhere on the map" />;

  if (isLoadingCityFetch) return <Spinner />;

  if (errorCityFetch) return <Message message={errorCityFetch} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/mm/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate("/app");
          }}
        >
          {" "}
          Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
