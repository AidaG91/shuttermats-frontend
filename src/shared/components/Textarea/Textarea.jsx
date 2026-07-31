import FormField from "../FormField/FormField";
import styles from "./Textarea.module.scss";

const Textarea = ({
  label,
  id,
  value,
  onChange,
  rows = 4,
  error,
  required = false,
  ...rest
}) => {
  const classes = [styles.textarea, error ? styles["textarea--error"] : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <FormField id={id} label={label} required={required} error={error}>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className={classes}
        {...rest}
      />
    </FormField>
  );
};

export default Textarea;
