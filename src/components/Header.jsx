"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useIntl } from "react-intl";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { slug: "", id: "home", defaultMessage: "Home" },
  { slug: "about-us", id: "aboutUs", defaultMessage: "About Us" },
  { slug: "our-vision", id: "ourVision", defaultMessage: "Our Vision" },
  { slug: "ANBI-information", id: "ANBIinformation", defaultMessage: "ANBI Information" },
  ...(process.env.NEXT_PUBLIC_EVENT_REGISTRATION_ENABLED === "true"
    ? [{ slug: "event", id: "event", defaultMessage: "Event" }]
    : []),
];

const languageOptions = [
  { value: "fa", label: "FA" },
  { value: "nl", label: "NL" },
  { value: "en", label: "EN" },
];

const Header = ({ locale }) => {
  const { formatMessage } = useIntl();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const currentSlug = pathname.split("/").slice(2).join("/");
  const hrefFor = (slug) => `/${locale}${slug ? `/${slug}` : ""}`;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 500) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className={`app-header ${locale === "fa" ? "rtl" : "ltr"}`}>
      <div className="page-content">
        {/* Logo */}
        <Link className="logo" href={`/${locale}`} aria-label="Licht van de Wereld — home">
          <Image
            className="logo-image"
            src="/images/licht-wereld-logo.png"
            alt="Logo van Kerk Licht van de Wereld"
            width={200}
            height={200}
            priority
            unoptimized
          />
        </Link>

        {/* Hamburger */}
        <button
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Language Selector */}
        <div className="lang-selector">
          <button
            type="button"
            className="language-button"
            aria-label="Select language"
            aria-expanded={languageOpen}
            aria-controls="language-menu"
            onClick={() => setLanguageOpen((current) => !current)}
          >
            {languageOptions.find((language) => language.value === locale)?.label}
          </button>
          {languageOpen && (
            <div id="language-menu" className="language-menu" role="menu">
              {languageOptions
                .filter((language) => language.value !== locale)
                .map((language) => (
                  <button
                    type="button"
                    role="menuitem"
                    key={language.value}
                    onClick={() => {
                      setLanguageOpen(false);
                      router.push(`/${language.value}${currentSlug ? `/${currentSlug}` : ""}`);
                    }}
                  >
                    {language.label}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={hrefFor(item.slug)}
              className={currentSlug === item.slug ? "active" : ""}
            >
              {formatMessage(item)}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <nav id="mobile-navigation" aria-label="Mobile navigation" className={`mobile-menu ${open ? "show" : ""}`}>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={hrefFor(item.slug)}
              className={currentSlug === item.slug ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {formatMessage(item)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
