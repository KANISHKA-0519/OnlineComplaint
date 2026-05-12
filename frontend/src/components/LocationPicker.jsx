import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons in Vite/React builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
});

const ClickHandler = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const LocationPicker = ({ value, onChange }) => {
  const position = value?.lat && value?.lng ? [value.lat, value.lng] : [20.5937, 78.9629]; // India center

  useEffect(() => {
    if (!value) onChange?.({ lat: null, lng: null });
  }, [value, onChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-600">Click on the map to pick a location</p>
        <p className="font-medium">
          {value?.lat && value?.lng ? `${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}` : "Not selected"}
        </p>
      </div>

      <div className="overflow-hidden rounded border">
        <MapContainer center={position} zoom={value?.lat ? 14 : 5} style={{ height: 260, width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={onChange} />
          {value?.lat && value?.lng ? <Marker position={[value.lat, value.lng]} /> : null}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;

