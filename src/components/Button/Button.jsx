import { Link } from "react-router";
import styles from "./Button.module.scss";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  fullWidth = false,
  disabled = false,
  loading = false,
  to,
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

  const content = (
    <>
      {loading ? (
        <span className={styles["sm-button__spinner"]} aria-hidden="true" />
      ) : null}
      <span className={styles.smButtonLabel}>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-disabled={disabled || undefined} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;
