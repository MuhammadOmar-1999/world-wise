import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../Contexts/CitiesContext";
import { useGeolocation } from "../Hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../Hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();

  const [mapPosition, setMapPosition] = useState([19, 72]);

  //Using custom hook previously created as a challenge
  const {
    isLoading: isLoadingPos,
    position: currentPosition,
    getPosition: getCurrentPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  //synchronizing map with current position of currently selected city
  useEffect(
    function () {
      if (mapLat && mapLng) {
        setMapPosition([mapLat, mapLng]);
      }
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (currentPosition)
        setMapPosition([currentPosition.lat, currentPosition.lng]);
    },
    [currentPosition]
  );

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getCurrentPosition}>
        {isLoadingPos ? "Loading..." : "get your position"}
      </Button>

      <MapContainer
        //center={} is not reactive, when mapPosition changes it is not refelected. To do that we need a custom component.
        // center={mapPosition}
        zoom={12}
        scrollWheelZoom={true}
        className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}>
            <Popup>
              {city.emoji} {city.cityName}
              <br />
              lat:{city.position.lat} <br />
              lng:{city.position.lng}
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />

        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  //useMap() is a hook provided by leaflet. That lets us change the view of the map dynamically by giving position and zoom value.
  const map = useMap();
  map.setView(position, 6);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
