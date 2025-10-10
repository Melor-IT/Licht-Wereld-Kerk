import "./style/main.css";
import Footer from "./component/Footer";
import Header from "./component/Header";
import Home from "./pages/Home";
import Contact from "./pages/Contact"; // ← در صورتی که صفحه Contact دارید

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IntlProvider } from "react-intl"; // ← برای ترجمه‌ها
import { useState } from "react";
import { messages } from "./i18n"; // ← فایل ترجمه‌ها (fa.json, nl.json)

function App() {
  const [locale, setLocale] = useState("fa"); // پیش‌فرض: فارسی

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <BrowserRouter>
        <main className="app">
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} /> {/* در صورت وجود */}
          </Routes>

          <Footer locale={locale} setLocale={setLocale} />
        </main>
      </BrowserRouter>
    </IntlProvider>
  );
}

export default App;
