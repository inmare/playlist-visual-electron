import "@scss/InputTextarea.scss";

export default function InputTextarea({
  uiText,
  value,
  rows,
  content,
  editable = true,
  update,
}: {
  uiText: string;
  value: string;
  rows: number;
  content: string;
  editable?: boolean;
  update?: (key: string, value: string) => void;
}) {
  return (
    <textarea
      className="input-textarea"
      name={value}
      id={value}
      placeholder={uiText}
      {...(editable ? {} : { disabled: true })}
      rows={rows}
      value={content}
      onChange={(event) => {
        update(value, event.target.value);
      }}
    />
  );
}
