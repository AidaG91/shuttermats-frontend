import FormField from "../FormField/FormField";
import styles from "./Select.module.scss";

const Select = ({
  label,
  id,
  value,
  onChange,
  options,
  error,
  required = false,
  ...rest
}) => {
  const classes = [styles.select, error ? styles["select--error"] : ""]
    .filter(Boolean)
    .join(" ");

  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  return (
    <FormField id={id} label={label} required={required} error={error}>
      <select value={value} onChange={onChange} className={classes} {...rest}>
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default Select;
