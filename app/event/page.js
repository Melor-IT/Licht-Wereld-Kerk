"use client";

import { useState } from "react";
import { useIntl } from "react-intl";
import BackgroundImage from "../../components/BackgroundImage";

export default function Event() {
  const { formatMessage } = useIntl();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    totalOfadults: 0,
    kidsgirls: 0,
    kidsboys: 0,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // -------------------- VALIDATION --------------------
  const validate = () => {
    const newErrors = {};

    // نام → فقط حروف (شامل حروف با لهجه) و فاصله
    if (!/^[A-Za-zÀ-ž\s]{2,}$/.test(formData.firstName.trim())) {
      newErrors.firstName = formatMessage({ id: "error.firstName" });
    }

    // نام خانوادگی
    if (!/^[A-Za-zÀ-ž\s]{2,}$/.test(formData.lastName.trim())) {
      newErrors.lastName = formatMessage({ id: "error.lastName" });
    }

    // ایمیل
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = formatMessage({ id: "error.email" });
    }

    // شماره تلفن هلند کمی استانداردتر
    if (!/^(0[6]\d{8}|\+316\d{8})$/.test(formData.phone.trim())) {
      newErrors.phone = formatMessage({ id: "error.phone" });
    }

    // اعداد
    ["totalOfadults", "kidsgirls", "kidsboys"].forEach((field) => {
      if (formData[field] < 0) {
        newErrors[field] = formatMessage({ id: "error.minZero" });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------- CHANGE HANDLER --------------------
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // -------------------- SUBMIT --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/send-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      setSubmitted(true);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        totalOfadults: 0,
        kidsgirls: 0,
        kidsboys: 0,
        message: "",
      });
    } catch (err) {
      alert(formatMessage({ id: "error.submit" }));
    } finally {
      setLoading(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="page event">
      <section>
        <BackgroundImage
          url="/images/event-banner.jpg"
          className="event-banner"
        />
        <div className="page-content">
          <h2>
            {formatMessage({
              id: "eventText",
              defaultMessage: "",
            })}
          </h2>
          <h4>
            {formatMessage({
              id: "eventOnder",
              defaultMessage: "(Johannes 1:5)",
            })}
          </h4>
        </div>
      </section>

      <section className="form">
        <div className="page-content">
          {submitted ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-green-600">
                🎉 {formatMessage({ id: "success.title" })}
              </h2>
              <p className="mt-2 text-gray-700">
                {formatMessage({ id: "success.message" })}
              </p>
            </div>
          ) : (
            <form className="form-block" onSubmit={handleSubmit} noValidate>
              {/* FIRST NAME */}
              <label>
                <span className="title">
                  {formatMessage({ id: "firstName" })}
                </span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && (
                  <p className="text-red-600">{errors.firstName}</p>
                )}
              </label>

              {/* LAST NAME */}
              <label>
                <span className="title">
                  {formatMessage({ id: "lastName" })}
                </span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <p className="text-red-600">{errors.lastName}</p>
                )}
              </label>

              {/* EMAIL */}
              <label>
                <span className="title">{formatMessage({ id: "email" })}</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-600">{errors.email}</p>}
              </label>

              {/* PHONE */}
              <label>
                <span className="title">{formatMessage({ id: "phone" })}</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && <p className="text-red-600">{errors.phone}</p>}
              </label>

              {/* ADULTS */}
              <label>
                <span className="title">
                  {formatMessage({ id: "totalOfadults" })}
                </span>
                <input
                  type="number"
                  name="totalOfadults"
                  min={0}
                  value={formData.totalOfadults}
                  onChange={handleChange}
                  required
                />
                {errors.totalOfadults && (
                  <p className="text-red-600">{errors.totalOfadults}</p>
                )}
              </label>

              {/* GIRLS */}
              <label>
                <span className="title">
                  {formatMessage({ id: "kidsgirls" })}{" "}
                  <small>*{formatMessage({ id: "onder" })}</small>
                </span>
                <input
                  type="number"
                  name="kidsgirls"
                  min={0}
                  value={formData.kidsgirls}
                  onChange={handleChange}
                  required
                />
                {errors.kidsgirls && (
                  <p className="text-red-600">{errors.kidsgirls}</p>
                )}
              </label>

              {/* BOYS */}
              <label>
                <span className="title">
                  {formatMessage({ id: "kidsboys" })}{" "}
                  <small>*{formatMessage({ id: "onder" })}</small>
                </span>
                <input
                  type="number"
                  name="kidsboys"
                  min={0}
                  value={formData.kidsboys}
                  onChange={handleChange}
                  required
                />
                {errors.kidsboys && (
                  <p className="text-red-600">{errors.kidsboys}</p>
                )}
              </label>

              {/* MESSAGE */}
              <label>
                <span className="title">
                  {formatMessage({ id: "message" })}
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </label>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading
                  ? formatMessage({ id: "sending" })
                  : formatMessage({ id: "send" })}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
