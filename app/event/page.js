"use client";

import { useState } from "react";
import { useIntl } from "react-intl";
import BackgroundImage from "../../components/BackgroundImage";

export default function Event() {
  const { formatMessage } = useIntl();

  // const initialState = {
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   totalOfadults: 0,
  //   kidsgirls6: 0,
  //   kidsgirls12: 0,
  //   kidsboys6: 0,
  //   kidsboys12: 0,
  //   message: "",
  // };

  // const [formData, setFormData] = useState(initialState);
  // const [submitted, setSubmitted] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [errors, setErrors] = useState({});

  // -------------------- VALIDATION --------------------
  // const validate = () => {
  //   const newErrors = {};

  //   if (!/^[A-Za-zÀ-ž\s]{2,}$/.test(formData.firstName.trim())) {
  //     newErrors.firstName = formatMessage({ id: "error.firstName" });
  //   }

  //   if (!/^[A-Za-zÀ-ž\s]{2,}$/.test(formData.lastName.trim())) {
  //     newErrors.lastName = formatMessage({ id: "error.lastName" });
  //   }

  //   if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
  //     newErrors.email = formatMessage({ id: "error.email" });
  //   }

  //   if (!/^(0[6]\d{8}|\+316\d{8})$/.test(formData.phone.trim())) {
  //     newErrors.phone = formatMessage({ id: "error.phone" });
  //   }

  //   const numberFields = [
  //     "totalOfadults",
  //     "kidsgirls6",
  //     "kidsgirls12",
  //     "kidsboys6",
  //     "kidsboys12",
  //   ];

  //   numberFields.forEach((field) => {
  //     if (formData[field] < 0) {
  //       newErrors[field] = formatMessage({ id: "error.minZero" });
  //     }
  //   });

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // -------------------- CHANGE HANDLER --------------------
  //  const handleChange = (e) => {
  //   const { name, value, type } = e.target;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "number" ? Number(value) : value,
  //   }));
  // };

  // -------------------- SUBMIT --------------------
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validate()) return;

  //   setLoading(true);

  //   try {
  //     const res = await fetch("/api/send-registration", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(formData),
  //     });

  //     if (!res.ok) throw new Error();

  //     setSubmitted(true);
  //     setFormData(initialState);
  //   } catch (err) {
  //     alert(formatMessage({ id: "error.submit" }));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // -------------------- UI --------------------
  return (
    <div className="page event">
      <section >
        <BackgroundImage
          url="/images/event-banner.jpg"
          className="event-banner"
        />
        <div className="page-content">
          <h2>{formatMessage({ id: "eventText" })}</h2>
          <h4>{formatMessage({ id: "eventOnder" })}</h4>
        </div>
      </section>
      <section className="closed-event">
          <h2>{formatMessage({ id: "closed" })}</h2>
      </section>
    
    </div>
    // <div className="page event">
    //   <section>
    //     <BackgroundImage
    //       url="/images/event-banner.jpg"
    //       className="event-banner"
    //     />
    //     <div className="page-content">
    //       <h2>{formatMessage({ id: "eventText" })}</h2>
    //       <h4>{formatMessage({ id: "eventOnder" })}</h4>
    //     </div>
    //   </section>

    //   <section className="form">
    //     <div className="page-content">
    //       {submitted ? (
    //         <div className="text-center py-10">
    //           <h3 className="mt-2 text-gray-700">
    //             🎉{formatMessage({ id: "success" })}
    //           </h3>
    //         </div>
    //       ) : (
    //         <form className="form-block" onSubmit={handleSubmit} noValidate>

    //           {/* FIRST NAME */}
    //           <label>
    //             <span className="title">
    //               {formatMessage({ id: "firstName" })}
    //             </span>
    //             <input
    //               type="text"
    //               name="firstName"
    //               value={formData.firstName}
    //               onChange={handleChange}
    //             />
    //             {errors.firstName && (
    //               <p className="text-red-600">{errors.firstName}</p>
    //             )}
    //           </label>

    //           {/* LAST NAME */}
    //           <label>
    //             <span className="title">
    //               {formatMessage({ id: "lastName" })}
    //             </span>
    //             <input
    //               type="text"
    //               name="lastName"
    //               value={formData.lastName}
    //               onChange={handleChange}
    //             />
    //             {errors.lastName && (
    //               <p className="text-red-600">{errors.lastName}</p>
    //             )}
    //           </label>

    //           {/* EMAIL */}
    //           <label>
    //             <span className="title">{formatMessage({ id: "email" })}</span>
    //             <input
    //               type="email"
    //               name="email"
    //               value={formData.email}
    //               onChange={handleChange}
    //             />
    //             {errors.email && <p className="text-red-600">{errors.email}</p>}
    //           </label>

    //           {/* PHONE */}
    //           <label>
    //             <span className="title">{formatMessage({ id: "phone" })}</span>
    //             <input
    //               type="tel"
    //               name="phone"
    //               value={formData.phone}
    //               onChange={handleChange}
    //             />
    //             {errors.phone && <p className="text-red-600">{errors.phone}</p>}
    //           </label>

    //           {/* ADULTS */}
    //           <label>
    //             <span className="title">
    //               {formatMessage({ id: "totalOfadults" })}
    //             </span>
    //             <input
    //               type="number"
    //               name="totalOfadults"
    //               min={0}
    //               value={formData.totalOfadults}
    //               onChange={handleChange}
    //             />
    //             {errors.totalOfadults && (
    //               <p className="text-red-600">{errors.totalOfadults}</p>
    //             )}
    //           </label>

    //           {/* GIRLS */}
    //           <div className="children-wrap">
    //             <label>
    //               <span className="title">
    //                 {formatMessage({ id: "kidsgirls6" })}
    //               </span>
    //               <input
    //                 type="number"
    //                 name="kidsgirls6"
    //                 min={0}
    //                 value={formData.kidsgirls6}
    //                 onChange={handleChange}
    //               />
    //             </label>

    //             <label>
    //               <span className="title">
    //                 {formatMessage({ id: "kidsgirls12" })}
    //               </span>
    //               <input
    //                 type="number"
    //                 name="kidsgirls12"
    //                 min={0}
    //                 value={formData.kidsgirls12}
    //                 onChange={handleChange}
    //               />
    //             </label>
    //           </div>

    //           {/* BOYS */}
    //           <div className="children-wrap">
    //             <label>
    //               <span className="title">
    //                 {formatMessage({ id: "kidsboys6" })}
    //               </span>
    //               <input
    //                 type="number"
    //                 name="kidsboys6"
    //                 min={0}
    //                 value={formData.kidsboys6}
    //                 onChange={handleChange}
    //               />
    //             </label>

    //             <label>
    //               <span className="title">
    //                 {formatMessage({ id: "kidsboys12" })}
    //               </span>
    //               <input
    //                 type="number"
    //                 name="kidsboys12"
    //                 min={0}
    //                 value={formData.kidsboys12}
    //                 onChange={handleChange}
    //               />
    //             </label>
    //           </div>

    //           {/* MESSAGE */}
    //           <label>
    //             <span className="title">
    //               {formatMessage({ id: "message" })}
    //             </span>
    //             <textarea
    //               name="message"
    //               value={formData.message}
    //               onChange={handleChange}
    //             ></textarea>
    //           </label>

    //           {/* SUBMIT BUTTON */}
    //           <button
    //             type="submit"
    //             className="w-full bg-red-600 text-white py-2 rounded"
    //             disabled={loading}
    //           >
    //             {loading
    //               ? formatMessage({ id: "sending" })
    //               : formatMessage({ id: "send" })}
    //           </button>
    //         </form>
    //       )}
    //     </div>
    //   </section>
    // </div>
  );
}
