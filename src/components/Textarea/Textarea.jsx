import styles from "./Textarea.module.scss";

const Textarea = ({
    label,
    id,
    value,
    onChange,
    rows = 4,
    error,
    required,
    ...rest
}) => {
    const classes = [
        styles.textarea,
        error ? styles["textarea--error"] : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={styles.field}>
            <label htmlFor={id} className={styles.label}>
                {label}
                {required && " *"}
            </label>

            <textarea
                id={id}
                value={value}
                onChange={onChange}
                rows={rows}
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

export default Textarea;
