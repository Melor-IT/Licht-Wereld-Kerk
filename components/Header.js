"use client";

import { useState } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import { usePathname } from "next/navigation";

const menuItems = [
  { to: "/", id: "home", defaultMessage: "Home" },
  { to: "/event", id: "event", defaultMessage: "Event" },
  { to: "/about-us", id: "aboutUs", defaultMessage: "About Us" },
  { to: "/our-vision", id: "ourVision", defaultMessage: "Our Vision" },
  {
    to: "/ANBI-information",
    id: "ANBIinformation",
    defaultMessage: "ANBI Information",
  },
];

const Header = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={`app-header ${locale === "fa" ? "rtl" : "ltr"}`}>
      <div className="page-content">
        {/* Logo */}
        <div className="logo">
          <img src="/images/Logo.png" alt="Logo" />
        </div>

        {/* Hamburger Menu Button */}
        <button
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* Language Selector */}
        <div className="lang-selector">
          <select
            id="language-select"
            className="language-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            aria-label="Select language"
          >
            <option value="fa">🇮🇷</option>
            <option value="nl">🇳🇱</option>
             <option value="en">EN</option>
          </select>
        </div>

        {/* Desktop Menu */}
        <nav className="nav-menu" aria-label="Main navigation">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.to}
              className={pathname === item.to ? "active" : ""}
            >
              {formatMessage({
                id: item.id,
                defaultMessage: item.defaultMessage,
              })}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${open ? "show" : ""}`}>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.to}
              onClick={() => setOpen(false)}
              className={pathname === item.to ? "active" : ""}
            >
              {formatMessage({
                id: item.id,
                defaultMessage: item.defaultMessage,
              })}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
