import styles from "./SectionHeading.module.css";

export default function SectionHeading({ eyebrow, title, description, align = "left", id, as: Heading = "h2" }) {
  return (
    <div className={`${styles.wrapper} ${align === "center" ? styles.center : ""}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <Heading id={id} className={styles.title}>
        {title}
      </Heading>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}
