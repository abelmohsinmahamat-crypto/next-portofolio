"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

const initialValues = {
  name: "",
  email: "",
  message: "",
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Indiquez votre nom.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Le nom doit contenir au moins 2 caractères.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Indiquez votre email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Le format de l'email est invalide.";
  }

  if (!values.message.trim()) {
    errors.message = "Écrivez un message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Le message doit contenir au moins 10 caractères.";
  }

  return errors;
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previous) => ({ ...previous, [name]: value }));

    if (errors[name]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[name];
        return next;
      });
    }

    if (status !== "idle") {
      setStatus("idle");
      setStatusMessage("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];

    if (firstError) {
      setStatus("error");
      setStatusMessage("Corrigez les champs indiqués avant de continuer.");
      document.getElementById(`contact-${firstError}`)?.focus();
      return;
    }

    setStatus("info");
    setStatusMessage(
      "Votre message est valide, mais aucun service d'envoi n'est configuré pour le moment : le message n'a pas été envoyé.",
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.formTitle}>Votre message</h2>

      <div className={styles.field}>
        <label htmlFor="contact-name">Nom</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          placeholder="Votre nom"
        />
        {errors.name ? (
          <p id="contact-name-error" className={styles.error} role="alert">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          placeholder="vous@exemple.com"
        />
        {errors.email ? (
          <p id="contact-email-error" className={styles.error} role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={handleChange}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          placeholder="Parlez-moi de votre projet, de vos objectifs ou de votre question."
        />
        {errors.message ? (
          <p id="contact-message-error" className={styles.error} role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>

      <button type="submit" className={`btn btn-primary ${styles.submit}`}>
        Envoyer le message
        <SendIcon />
      </button>

      {status !== "idle" ? (
        <p
          className={`${styles.status} ${status === "error" ? styles.statusError : styles.statusInfo}`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      ) : null}

      <p className={styles.note}>
        Ce formulaire valide les champs côté client. Aucun service d’envoi n’est connecté pour l’instant.
      </p>
    </form>
  );
}
