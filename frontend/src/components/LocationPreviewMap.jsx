import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons in Vite/React builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
});

const Recenter = ({ lat, lng, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom, { animate: true });
  }, [lat, lng, zoom, map]);
  return null;
};

const LocationPreviewMap = ({ lat, lng }) => {
  const safeLat = Number.isFinite(lat) ? lat : 11.29;
  const safeLng = Number.isFinite(lng) ? lng : 77.58;

  const zoom = useMemo(() => (Number.isFinite(lat) && Number.isFinite(lng) ? 13 : 5), [lat, lng]);

  return (
    <div className="h-[300px] w-full overflow-hidden rounded-lg">
      <MapContainer center={[safeLat, safeLng]} zoom={zoom} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter lat={safeLat} lng={safeLng} zoom={zoom} />
        <Marker position={[safeLat, safeLng]} />
      </MapContainer>
    </div>
  );
};

export default LocationPreviewMap;

