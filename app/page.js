import HomePage from "../components/HomePage";

export const metadata = {
  metadataBase: new URL("https://lichtwereld.com"),
  title: "Iraanse Kerk Licht van de Wereld | Almere",
  description:
    "De Iraanse Kerk Licht van de Wereld in Almere — een plaats voor aanbidding, gebed en geestelijke groei in de aanwezigheid van Jezus Christus.",
  keywords: [
    "Iraanse kerk",
    "Licht van de Wereld",
    "Christelijke kerk",
    "Almere",
    "aanbidding",
    "gebed",
    "Jezus Christus",
  ],
  openGraph: {
    title: "Iraanse Kerk Licht van de Wereld",
    description:
      "Welkom bij de Iraanse Kerk Licht van de Wereld in Almere — een plaats van aanbidding en dienst tot eer van Jezus Christus.",
    url: "/",
    siteName: "Iraanse Kerk Licht van de Wereld",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: "/images/home-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Iraanse Kerk Licht van de Wereld in Almere",
      },
    ],
  },
};

export default function Page() {
  return <HomePage />;
}
