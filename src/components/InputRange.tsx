import { useEffect, useState } from "react";
import { Song } from "@ts/song";
import "@scss/InputRange.scss";

export default function InputRange({
  min,
  max,
  step,
  defaultValue,
  disabled,
  updatePos,
  songs,
  songIdx,
}: {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  disabled: boolean;
  updatePos: (pos: number) => void;
  songs: Song[];
  songIdx: number;
}) {
  const [rangeValue, setRangeValue] = useState(defaultValue);

  useEffect(() => {
    if (songIdx < 0) return;
    const imagePos = songs[songIdx].imgPos;
    setRangeValue(imagePos);
  }, [songIdx]);

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
        value={rangeValue}
        onChange={(event) => {
          setRangeValue(Number(event.target.value));
          updatePos(Number(event.target.value));
        }}
        disabled={disabled}
      />
    </div>
  );
}
