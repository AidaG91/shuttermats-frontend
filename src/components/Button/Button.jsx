import styles from "./Button.module.scss";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  ...rest
}) => {
  const classes = [
    "sm-button",
    `sm-button--${variant}`,
    `sm-button--${size}`,
    fullWidth ? "sm-button--full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <span className={styles.smButtonSpinner}aria-hidden="true" />
      ) : null}
      <span className={styles.smButtonLabel}>{children}</span>
    </button>
  );
};

export default Button;
