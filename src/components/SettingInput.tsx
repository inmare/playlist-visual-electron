import "@scss/SettingInput.scss";

export default function (prop: {
  uiText: string;
  value: string;
  content: string;
  update: (key: string, value: string) => void;
}) {
  const { uiText, value, content, update } = prop;
  return (
    <div className="setting-input">
      <label className="setting-input-label" htmlFor={value}>
        {uiText}
      </label>
      <textarea
        className="setting-input-textarea"
        name={value}
        id={value}
        placeholder={uiText}
        onChange={(event) => {
          update(value, event.target.value);
        }}
        contentEditable="true"
        value={content}
      ></textarea>
    </div>
  );
}
