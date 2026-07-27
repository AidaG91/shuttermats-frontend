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
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && " *"}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={classes}
        {...rest}
      />

      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
