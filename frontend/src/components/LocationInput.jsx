import { useMemo } from "react";
import LocationPreviewMap from "./LocationPreviewMap";
import { theme } from "../utils/theme";

const parseNumber = (value) => {
  if (value === "" || value === null || typeof value === "undefined") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
};

const LocationInput = ({ value, onChange }) => {
  const latNum = useMemo(() => parseNumber(value?.lat ?? ""), [value?.lat]);
  const lngNum = useMemo(() => parseNumber(value?.lng ?? ""), [value?.lng]);

  const latValid = latNum === null || (!Number.isNaN(latNum) && latNum >= -90 && latNum <= 90);
  const lngValid = lngNum === null || (!Number.isNaN(lngNum) && lngNum >= -180 && lngNum <= 180);

  const canPreview = latValid && lngValid && latNum !== null && lngNum !== null;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-200">Latitude</label>
          <input
            value={value?.lat ?? ""}
            onChange={(e) => onChange?.({ ...value, lat: e.target.value })}
            placeholder="e.g. 12.9716"
            className={`${theme.input} ${latValid ? "" : "border-red-400"}`}
          />
          {!latValid && <p className="mt-1 text-xs text-red-600">Latitude must be between -90 and 90</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-200">Longitude</label>
          <input
            value={value?.lng ?? ""}
            onChange={(e) => onChange?.({ ...value, lng: e.target.value })}
            placeholder="e.g. 77.5946"
            className={`${theme.input} ${lngValid ? "" : "border-red-400"}`}
          />
          {!lngValid && <p className="mt-1 text-xs text-red-600">Longitude must be between -180 and 180</p>}
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/30 p-3">
        <p className="mb-2 text-sm font-medium text-slate-200">Location Preview</p>
        <LocationPreviewMap
          lat={canPreview ? latNum : undefined}
          lng={canPreview ? lngNum : undefined}
        />
        <p className="mt-2 text-xs text-slate-300">
          Tip: enter valid coordinates to preview the exact marker location.
        </p>
      </div>
    </div>
  );
};

export default LocationInput;

