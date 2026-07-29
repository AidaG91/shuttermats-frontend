import FormField from "../FormField/FormField";
import styles from "./Input.module.scss";

const Input = ({
  label,
  id,
  value,
  onChange,
  type = "text",
  required = false,
  error,
  ...rest
}) => {
  const classes = [styles.input, error ? styles["input--error"] : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <FormField id={id} label={label} required={required} error={error}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={classes}
        {...rest}
      />
    </FormField>
  );
};

export default Input;
