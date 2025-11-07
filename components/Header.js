"use client";

import Link from "next/link";
import { useIntl } from "react-intl";
import { usePathname } from "next/navigation";

const menuItems = [
  { to: "/", id: "home", defaultMessage: "Home" },
  { to: "/about-us", id: "aboutUs", defaultMessage: "About Us" },
  { to: "/our-vision", id: "ourVision", defaultMessage: "Our Vision" },
  { to: "/event", id: "event", defaultMessage: "Event" },
  {
    to: "/ANBI-information",
    id: "ANBIinformation",
    defaultMessage: "ANBI Information",
  },
];

const Header = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();
  const pathname = usePathname();

  return (
    <header className={`app-header ${locale === "fa" ? "rtl" : "ltr"}`}>
      <div className="page-content">
     
     
          <div className="logo">
            <img src="/images/Logo.png" alt="Logo" />
          </div>
     
     

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
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
