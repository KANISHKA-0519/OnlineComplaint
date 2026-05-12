import { useMemo, useState } from "react";

const RatingStars = ({ value, onChange, readOnly = false, size = "text-lg" }) => {
  const [hoverValue, setHoverValue] = useState(null);

  const displayValue = useMemo(() => {
    if (hoverValue !== null) return hoverValue;
    return typeof value === "number" ? value : 0;
  }, [hoverValue, value]);

  const handleClick = (rating) => {
    if (readOnly || !onChange) return;
    onChange(rating);
  };

  return (
    <div className={`inline-flex items-center gap-1 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            className={`leading-none ${readOnly ? "cursor-default" : "cursor-pointer"} ${
              filled ? "text-yellow-500" : "text-slate-300"
            }`}
            onMouseEnter={() => (!readOnly ? setHoverValue(star) : null)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => handleClick(star)}
            aria-label={`Rate ${star} star`}
            disabled={readOnly}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;

