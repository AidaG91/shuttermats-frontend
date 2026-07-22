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
    styles["sm-button"],
    styles[`sm-button--${variant}`],
    styles[`sm-button--${size}`],
    fullWidth ? styles["sm-button--full"] : "",
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
      {loading ? <span className={styles["sm-button__spinner"]} /> : null}
      <span className={styles.smButtonLabel}>{children}</span>
    </button>
  );
};

export default Button;
