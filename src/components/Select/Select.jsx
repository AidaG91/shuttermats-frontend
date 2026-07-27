import styles from "./Select.module.scss";

const Select = ({
    label,
    id,
    value,
    onChange,
    options,
    error,
    required,
    ...rest
}) => {
    const classes = [
        styles.select,
        error ? styles["select--error"] : "",
    ]
        .filter(Boolean)
        .join(" ");

    const normalizedOptions = options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: opt } : opt
    );

    return (
        <div className={styles.field}>
            <label htmlFor={id} className={styles.label}>
                {label}
                {required && " *"}
            </label>

            <select
                id={id}
                value={value}
                onChange={onChange}
                className={classes}
                {...rest}
            >
                {normalizedOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && (
                <span className={styles.errorMessage} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Select;