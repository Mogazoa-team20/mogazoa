import styles from "./LoadingSpinner.module.scss";

export default function LoadingSpinner({ title }: { title: string }) {
  return (
    <div className={styles.loading}>
      <div className={styles["lds-spinner"]}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
      <p className={styles.uploadingText}>{title}</p>
    </div>
  );
}
