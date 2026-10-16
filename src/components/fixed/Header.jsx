"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useIntl } from "react-intl";
import { usePathname } from "next/navigation";
import {
  FaArrowRight, FaCalendarAlt, FaChevronDown,
  FaGlobe, FaHome, FaInfoCircle, FaPlay, FaRegCompass, FaUsers,
} from "react-icons/fa";

const menuItems = [
  { slug: "", id: "home", defaultMessage: "Home", icon: FaHome },
  { slug: "about-us", id: "aboutUs", defaultMessage: "About Us", icon: FaUsers },
  { slug: "our-vision", id: "ourVision", defaultMessage: "Our Vision", icon: FaRegCompass },
  { slug: "sermons", id: "sermons", defaultMessage: "Sermons", icon: FaPlay },
  { slug: "ANBI-information", id: "ANBIinformation", defaultMessage: "ANBI Information", icon: FaInfoCircle },
  { slug: "event", id: "event", defaultMessage: "Events", icon: FaCalendarAlt },
];

const languageOptions = [
  { value: "fa", code: "FA", label: "فارسی", direction: "rtl" },
  { value: "nl", code: "NL", label: "Nederlands", direction: "ltr" },
  { value: "en", code: "EN", label: "English", direction: "ltr" },
];

function HeaderNavigation({ locale, pathname }) {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef(null);
  const languageButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const headerRef = useRef(null);
  const currentSlug = pathname.split("/").slice(2).join("/");
  const hrefFor = (slug, language = locale) => `/${language}${slug ? `/${slug}` : ""}`;
  const t = (id) => formatMessage({ id });
  const currentLanguage = languageOptions.find((language) => language.value === locale);
  const otherLanguages = languageOptions.filter((language) => language.value !== locale);

  useEffect(() => {
    const header = headerRef.current;
    const updateHeight = () => {
      document.documentElement.style.setProperty("--header-height", `${Math.ceil(header.getBoundingClientRect().height)}px`);
    };
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    updateHeight();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-height");
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1180px)");
    const closeOnDesktop = () => {
      if (desktop.matches) dialogRef.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (!languageOpen) return;
    const closeOutside = (event) => {
      if (!languageRef.current?.contains(event.target)) setLanguageOpen(false);
    };
    const closeWithEscape = (event) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        languageButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [languageOpen]);

  function openNavigation() {
    setLanguageOpen(false);
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeNavigation() {
    dialogRef.current?.close();
  }

  function closeFromBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) closeNavigation();
  }

  function keepFocusInNavigation(event) {
    if (event.key !== "Tab") return;
    const controls = event.currentTarget.querySelectorAll('a[href], button:not([disabled])');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  const brand = (
    <Link className="header-brand" href={hrefFor("")} onClick={closeNavigation} aria-label={`${t("headerBrand")} — ${t("home")}`}>
      <Image className="logo-image" src="/images/licht-wereld-logo.png" alt="" width={64} height={64} priority unoptimized />
      <span className="brand-copy">
        <strong>{t("headerBrand")}</strong>
        <span>{t("headerLocation")}</span>
      </span>
    </Link>
  );

  return (
    <header className={`app-header ${locale === "fa" ? "rtl" : "ltr"}`} ref={headerRef}>
      <div className="header-bar">
        {brand}
        <nav className="nav-menu" aria-label={t("navigationLabel")}>
          {menuItems.map((item) => (
            <Link key={item.id} href={hrefFor(item.slug)} className={currentSlug === item.slug ? "active" : ""} aria-current={currentSlug === item.slug ? "page" : undefined}>
              {formatMessage(item)}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <div className="lang-selector" ref={languageRef} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setLanguageOpen(false);
          }}>
            <button ref={languageButtonRef} type="button" className="language-button" aria-label={t("selectLanguage")} aria-expanded={languageOpen} aria-controls="language-menu" onClick={() => setLanguageOpen((current) => !current)}>
              <FaGlobe aria-hidden="true" />
              <span>{currentLanguage.code}</span>
              <FaChevronDown className="language-chevron" aria-hidden="true" />
            </button>
            {languageOpen && (
              <nav id="language-menu" className="language-menu" aria-label={t("selectLanguage")}>
                <p>{t("selectLanguage")}</p>
                {otherLanguages.map((language) => (
                  <Link key={language.value} href={hrefFor(currentSlug, language.value)} hrefLang={language.value} onClick={() => setLanguageOpen(false)}>
                    <span className="language-code">{language.code}</span>
                    <span lang={language.value} dir={language.direction}>{language.label}</span>
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <button type="button" className="menu-toggle" onClick={openNavigation} aria-label={t("openMenu")} aria-expanded={open} aria-controls="mobile-navigation" aria-haspopup="dialog">
            <span className="menu-toggle-lines" aria-hidden="true"><span /><span /></span>
          </button>
        </div>
      </div>
      <dialog id="mobile-navigation" className="navigation-drawer" ref={dialogRef} aria-labelledby="navigation-title" onClose={() => setOpen(false)} onClick={closeFromBackdrop} onKeyDown={keepFocusInNavigation}>
        <div className="drawer-header">
          {brand}
          <button type="button" className="menu-close" onClick={closeNavigation} aria-label={t("closeMenu")} autoFocus><span aria-hidden="true">×</span></button>
        </div>
        <div className="drawer-content">
          <p className="drawer-eyebrow">{t("navigationLabel")}</p>
          <h2 id="navigation-title">{t("menuTitle")}</h2>
          <nav className="mobile-menu" aria-label={t("navigationLabel")}>
            {menuItems.map(({ icon: Icon, ...item }) => (
              <Link key={item.id} href={hrefFor(item.slug)} className={currentSlug === item.slug ? "active" : ""} aria-current={currentSlug === item.slug ? "page" : undefined} onClick={closeNavigation}>
                <span className="mobile-link-icon"><Icon aria-hidden="true" /></span>
                <span>{formatMessage(item)}</span>
                <FaArrowRight className="mobile-link-arrow" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
        <div className="drawer-languages">
          <p><FaGlobe aria-hidden="true" />{t("selectLanguage")}</p>
          <nav aria-label={t("selectLanguage")}>
            {otherLanguages.map((language) => (
              <Link key={language.value} href={hrefFor(currentSlug, language.value)} hrefLang={language.value} lang={language.value} dir={language.direction} onClick={closeNavigation}>{language.label}</Link>
            ))}
          </nav>
        </div>
      </dialog>
    </header>
  );
}

export default function Header({ locale }) {
  const pathname = usePathname();
  return <HeaderNavigation key={pathname} locale={locale} pathname={pathname} />;
}
