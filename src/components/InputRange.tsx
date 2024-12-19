import { useState } from "react";
import "@scss/InputRange.scss";

export default function InputRange({
  min,
  max,
  step,
  defaultValue,
  disabled,
  updatePos,
}: {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  disabled: boolean;
  updatePos: (pos: number) => void;
}) {
  const [rangeValue, setRangeValue] = useState(defaultValue);

  return (
    <div className={"input-range" + (disabled ? " input-disabled" : "")}>
      <div className={"input-background" + (disabled ? " input-disabled" : "")}>
        <div
          className="input-progress"
          style={{
            width: `${((rangeValue - min) / (max - Math.abs(min))) * 100}%`,
          }}
        ></div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        onChange={(event) => {
          setRangeValue(Number(event.target.value));
          updatePos(Number(event.target.value));
        }}
        disabled={disabled}
      />
    </div>
  );
}
