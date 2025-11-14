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

  const validate = () => {
    const newErrors = {};

    // نام و نام خانوادگی: فقط حروف و فاصله
    if (!/^[a-zA-Z\s]{2,}$/.test(formData.firstName)) {
      newErrors.firstName = "Please enter a valid first name";
    }
    if (!/^[a-zA-Z\s]{2,}$/.test(formData.lastName)) {
      newErrors.lastName = "Please enter a valid last name";
    }

    // ایمیل
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // شماره تلفن هلندی: شروع با 06 یا +316 و 8 رقم بعد
    if (!/^(06\d{8}|\+316\d{8})$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Dutch phone number";
    }

    // تعداد افراد و فرزندان
    if (formData.totalOfadults < 0)
      newErrors.totalOfadults = "Must be 0 or more";
    if (formData.kidsgirls < 0) newErrors.kidsgirls = "Must be 0 or more";
    if (formData.kidsboys < 0) newErrors.kidsboys = "Must be 0 or more";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

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

      if (res.ok) {
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
      } else {
        alert("Error submitting form 😔");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form 😔");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page event">
      <section>
        <BackgroundImage
          url="/images/event-banner.jpeg"
          className="event-banner"
        />
      </section>

      <section className="form">
        <div className="page-content">
          {submitted ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-green-600">
                🎉 Thank you for your registration!
              </h2>
              <p className="mt-2 text-gray-700">
                We have received your form successfully.
              </p>
            </div>
          ) : (
            <form className="form-block" onSubmit={handleSubmit} noValidate>
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

              <label>
                <span className="title">
                  {formatMessage({ id: "totalOfadults" })}
                </span>
                <input
                  type="number"
                  name="totalOfadults"
                  value={formData.totalOfadults}
                  onChange={handleChange}
                  required
                  min={0}
                />
                {errors.totalOfadults && (
                  <p className="text-red-600">{errors.totalOfadults}</p>
                )}
              </label>

              <label>
                <span className="title">
                  {formatMessage({ id: "kidsgirls" })}
                </span>
                <input
                  type="number"
                  name="kidsgirls"
                  value={formData.kidsgirls}
                  onChange={handleChange}
                  required
                  min={0}
                />
                {errors.kidsgirls && (
                  <p className="text-red-600">{errors.kidsgirls}</p>
                )}
              </label>

              <label>
                <span className="title">
                  {formatMessage({ id: "kidsboys" })}
                </span>
                <input
                  type="number"
                  name="kidsboys"
                  value={formData.kidsboys}
                  onChange={handleChange}
                  required
                  min={0}
                />
                {errors.kidsboys && (
                  <p className="text-red-600">{errors.kidsboys}</p>
                )}
              </label>

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
                {loading ? "Sending..." : formatMessage({ id: "send" })}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
