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

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("🎉 The form has been submitted successfully!");
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
          <form className="form-block" onSubmit={handleSubmit}>
            <label>
              <span className="title">{formatMessage({ id: "firstName" })}</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="title">{formatMessage({ id: "lastName" })}</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
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
            </label>

            <label>
              <span className="title">{formatMessage({ id: "totalOfadults" })}</span>
              <input
                type="number"
                name="totalOfadults"
                value={formData.totalOfadults}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="title">{formatMessage({ id: "kidsgirls" })}</span>
              <input
                type="number"
                name="kidsgirls"
                value={formData.kidsgirls}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </label>

            <label>
              <span className="title">{formatMessage({ id: "kidsboys" })}</span>
              <input
                type="number"
                name="kidsboys"
                value={formData.kidsboys}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="title">  {formatMessage({ id: "message"})}</span>
              <textarea
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </label>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded"
            >
              {formatMessage({ id: "send" })}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
