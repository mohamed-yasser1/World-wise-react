import { useNavigate, useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useCities } from "../../contexts/CitiesContext";
import { useEffect } from "react";
import Button from "../Button/Button";
import Spinner from "../Spinner/Spinner";
import Message from "../Message/Message";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function City() {
  const { currentCity, getCurrentCity, isLoading, errorMsg } = useCities();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(
    function () {
      getCurrentCity(id);
    },
    [id, getCurrentCity]
  );

  if (isLoading) return <Spinner />;

  if (errorMsg) return <Message message={errorMsg} />;

  if (currentCity === undefined) return;

  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate("/app");
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
}

export default City;
