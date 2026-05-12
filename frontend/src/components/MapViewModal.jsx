import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { theme } from "../utils/theme";

const MapViewModal = ({ open, onClose, lat, lng, title = "Complaint Location" }) => {
  if (!open) return null;

  const hasCoords = typeof lat === "number" && typeof lng === "number";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full max-w-2xl overflow-hidden ${theme.modal}`}>
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className={theme.buttonSecondary}
          >
            Close
          </button>
        </div>

        <div className="p-4">
          {!hasCoords ? (
            <p className="text-slate-300">No location coordinates available for this complaint.</p>
          ) : (
            <div className="overflow-hidden rounded border border-slate-700">
              <MapContainer center={[lat, lng]} zoom={13} style={{ height: 320, width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} />
              </MapContainer>
            </div>
          )}

          {hasCoords && (
            <p className="mt-3 text-sm text-slate-300">
              Coordinates: <span className="font-medium">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapViewModal;

