import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useCities } from "../../contexts/CitiesContext";
import Button from "../Button/Button";

import styles from "./Map.module.css";
import useGeoloaction from "../../hooks/useGeoloaction";
import useUrlPosition from "../../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([
    52.53586782505711, 13.376933665713324,
  ]);
  const geolocation = useGeoloaction();
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocation.position)
        setMapPosition([geolocation.position.lat, geolocation.position.lng]);
    },
    [geolocation.position]
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocation.position && (
        <Button type="position" onClick={geolocation.getPosition}>
          {geolocation.position ? "...loading" : "use your position"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeView position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeView({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
