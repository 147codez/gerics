// Reine Daten/Typen, ohne Server-Abhängigkeiten (auch in Client-Komponenten nutzbar).
export type Lang = "de" | "en";
export const LANGS: Lang[] = ["de", "en"];
export const LANG_COOKIE = "lang";

type Dict = {
  nav: { start: string; gallery: string; about: string; contact: string };
  categories: { sport: string; fahrzeuge: string; natur: string; architektur: string };
  galleryPage: {
    title: string;
    sub: string;
    more: string;
    catSub: string;
    back: string;
  };
  meta: { homeTitle: string; homeDesc: string; aboutTitle: string };
  home: {
    tagline: string;
    eyebrow: string;
    headline: string;
    intro: string;
    aboutBtn: string;
    contactBtn: string;
    galleryTitle: string;
    gallerySub: string;
    discover: string;
  };
  gallery: { comingSoon: string };
  flickr: {
    eyebrow: string;
    title: string;
    leftLabel: string;
    leftPeriod: string;
    rightLabel: string;
    rightPeriod: string;
    cta: string;
    newSoon: string;
    stats: { views: string; favorites: string; tags: string; groups: string };
  };
  about: {
    eyebrow: string;
    heading: string;
    p1: string;
    p2: string;
    p3: string;
    portraitAlt: string;
    storyTitle: string;
    storyAlt: string;
    contactTitle: string;
    contactText: string;
    form: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      message: string;
      send: string;
      sending: string;
      success: string;
      error: string;
    };
  };
  footer: { rights: string; imagesCopyright: string; impressum: string; privacy: string; builtBy: string };
  legal: {
    impressumTitle: string;
    privacyTitle: string;
    updated: string;
    backHome: string;
    sections: {
      impressum: { h: string; p: string }[];
      privacy: { h: string; p: string }[];
    };
  };
};

export const dict: Record<Lang, Dict> = {
  de: {
    nav: { start: "Start", gallery: "Galerie", about: "Über uns", contact: "Kontakt" },
    categories: { sport: "Sport", fahrzeuge: "Fahrzeuge", natur: "Natur", architektur: "Architektur" },
    galleryPage: {
      title: "Galerie",
      sub: "Vier Themen, ein Blick. Ausgewählte Bilder pro Kategorie.",
      more: "Mehr ansehen →",
      catSub: "Alle Bilder dieser Kategorie.",
      back: "← Zur Galerie",
    },
    meta: {
      homeTitle: "Fotografie seit über 30 Jahren",
      homeDesc: "Fotografie seit über 30 Jahren.",
      aboutTitle: "Über uns",
    },
    home: {
      tagline: "Fotografie seit über 30 Jahren",
      eyebrow: "Herzlich willkommen",
      headline: "Schön, dass Sie da sind.",
      intro:
        "Seit über 30 Jahren fange ich Licht, Menschen und Momente ein. Kein Effekt, kein Lärm, nur das Bild, das bleibt. Nehmen Sie sich einen Moment und schauen Sie sich um.",
      aboutBtn: "Über mich",
      contactBtn: "Kontakt aufnehmen",
      galleryTitle: "Ausgewählte Bilder",
      gallerySub: "Eine neue Auswahl, jede Woche.",
      discover: "Entdecken",
    },
    gallery: { comingSoon: "Bild folgt" },
    flickr: {
      eyebrow: "Mein Flickr-Archiv",
      title: "Über 30 Jahre in Bildern",
      leftLabel: "Gewachsenes Archiv",
      leftPeriod: "2007 – 2026",
      rightLabel: "Neuer Anfang",
      rightPeriod: "2026 –",
      cta: "Das ganze Archiv auf Flickr ansehen →",
      newSoon: "Neues Profil folgt",
      stats: { views: "Aufrufe", favorites: "Favoriten", tags: "Tags", groups: "Gruppen" },
    },
    about: {
      eyebrow: "Über mich",
      heading: "Über 30 Jahre hinter der Kamera",
      p1: "Seit über 30 Jahren fotografiere ich. Gelebt habe ich in vier Kantonen und eine Zeit lang in Kuala Lumpur, Malaysia. Egal wohin es ging, das Erste im Gepäck waren immer meine Kameras.",
      p2: "Mich interessiert der Moment, nicht der Aufwand danach. Am fertigen Bild drehe ich höchstens ein wenig an Sättigung und Kontrast, mehr braucht es selten.",
      p3: "Und ehrlich gesagt: für RAW bin ich zu faul. Was zählt, ist das Bild, das bleibt, nicht die Stunden davor am Bildschirm.",
      portraitAlt: "Porträt von Geri",
      storyTitle: "Niemals vergessen, wer du bist.",
      storyAlt: "Zeitungsartikel über Mahmoud Geri Geranmayeh",
      contactTitle: "Kontakt",
      contactText: "Schreiben Sie mir, ich melde mich persönlich zurück.",
      form: {
        firstName: "Vorname",
        lastName: "Name",
        email: "E-Mail",
        phone: "Telefon",
        message: "Ihr Anliegen",
        send: "Absenden",
        sending: "Wird gesendet …",
        success: "Danke, Ihre Nachricht ist unterwegs. Ich melde mich bald.",
        error: "Da ging etwas schief. Bitte später erneut versuchen oder direkt an info@gerics.ch schreiben.",
      },
    },
    footer: {
      rights: "Alle Rechte vorbehalten.",
      imagesCopyright: "Alle Bilder sind urheberrechtlich geschützt.",
      impressum: "Impressum",
      privacy: "Datenschutz",
      builtBy: "Erstellt von",
    },
    legal: {
      impressumTitle: "Impressum",
      privacyTitle: "Datenschutz",
      updated: "Stand: August 2026",
      backHome: "Zurück zur Startseite",
      sections: {
        impressum: [
          {
            h: "Verantwortlich",
            p: "Ger𝓲cs — Mahmoud-Geri Geranmayeh\nStettfurterstrasse 4b\nCH-9548 Matzingen\nE-Mail: info@gerics.ch",
          },
          {
            h: "Urheberrecht der Bilder",
            p: "Sämtliche auf dieser Website gezeigten Fotografien und Bilder sind urheberrechtlich geschützt und Eigentum von Ger𝓲cs. Jede Nutzung, Vervielfältigung, Bearbeitung, Weitergabe oder Veröffentlichung, ganz oder in Teilen, ist ohne vorherige ausdrückliche schriftliche Zustimmung untersagt. Zuwiderhandlungen werden rechtlich verfolgt.",
          },
          {
            h: "Haftungsausschluss",
            p: "Die Inhalte dieser Website werden mit grösstmöglicher Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr übernommen. Für Inhalte externer Links sind ausschliesslich deren Betreiber verantwortlich.",
          },
        ],
        privacy: [
          {
            h: "Verantwortliche Stelle",
            p: "Verantwortlich für die Datenbearbeitung ist Ger𝓲cs, info@gerics.ch. Wir halten uns an das schweizerische Datenschutzgesetz (revDSG).",
          },
          {
            h: "Welche Daten wir bearbeiten",
            p: "Diese Website nutzt Google Analytics (Google Ireland Ltd.) zur anonymisierten Auswertung von Besucherzahlen und Seitenaufrufen, um das Angebot zu verbessern. Dabei werden technische Daten (z. B. gekürzte IP-Adresse, Browsertyp, Gerät, aufgerufene Seiten) verarbeitet und an Google übertragen, teils in die USA. Weitere personenbezogene Daten entstehen nur, wenn Sie uns per E-Mail kontaktieren; diese verwenden wir ausschliesslich zur Beantwortung Ihrer Anfrage.",
          },
          {
            h: "Cookies",
            p: "Für Ihre Sprachwahl (Deutsch/Englisch) wird ein technisch notwendiges Cookie gesetzt. Google Analytics setzt zusätzlich Cookies zur Reichweitenmessung. Sie können Cookies in Ihrem Browser jederzeit blockieren oder löschen; die Erfassung durch Google lässt sich zudem mit dessen Browser-Add-on unterbinden.",
          },
          {
            h: "Server-Protokolle",
            p: "Beim Aufruf der Website kann der Hosting-Anbieter technische Zugriffsdaten (z. B. IP-Adresse, Zeitpunkt, abgerufene Seite) protokollieren. Diese dienen dem sicheren Betrieb und werden nicht mit anderen Daten zusammengeführt.",
          },
          {
            h: "Ihre Rechte",
            p: "Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer gespeicherten Daten. Wenden Sie sich dazu an info@gerics.ch.",
          },
        ],
      },
    },
  },
  en: {
    nav: { start: "Home", gallery: "Gallery", about: "About", contact: "Contact" },
    categories: { sport: "Sports", fahrzeuge: "Vehicles", natur: "Nature", architektur: "Architecture" },
    galleryPage: {
      title: "Gallery",
      sub: "Four themes, one eye. Selected images per category.",
      more: "See more →",
      catSub: "All images in this category.",
      back: "← Back to gallery",
    },
    meta: {
      homeTitle: "Photography for over 30 years",
      homeDesc: "Photography for over 30 years.",
      aboutTitle: "About",
    },
    home: {
      tagline: "Photography for over 30 years",
      eyebrow: "Welcome",
      headline: "Good to have you here.",
      intro:
        "For over 30 years I've been capturing light, people and moments. No effects, no noise, just the image that lasts. Take a moment and have a look around.",
      aboutBtn: "About me",
      contactBtn: "Get in touch",
      galleryTitle: "Selected images",
      gallerySub: "A new selection, every week.",
      discover: "Discover",
    },
    gallery: { comingSoon: "Image coming" },
    flickr: {
      eyebrow: "My Flickr archive",
      title: "Over 30 years in images",
      leftLabel: "Established archive",
      leftPeriod: "2007 – 2026",
      rightLabel: "New beginning",
      rightPeriod: "2026 –",
      cta: "See the full archive on Flickr →",
      newSoon: "New profile coming",
      stats: { views: "Views", favorites: "Favorites", tags: "Tags", groups: "Groups" },
    },
    about: {
      eyebrow: "About me",
      heading: "Over 30 years behind the camera",
      p1: "I've been photographing for over 30 years. I've lived in four Swiss cantons and, for a while, in Kuala Lumpur, Malaysia. Wherever I went, the first thing I packed was always my cameras.",
      p2: "I care about the moment, not the work afterwards. On the finished image I'll nudge the saturation and contrast a little at most, rarely more.",
      p3: "And honestly: I'm too lazy for RAW. What counts is the image that lasts, not the hours in front of a screen.",
      portraitAlt: "Portrait of Geri",
      storyTitle: "Never forget who you are.",
      storyAlt: "Newspaper article about Mahmoud Geri Geranmayeh",
      contactTitle: "Contact",
      contactText: "Drop me a line and I'll get back to you personally.",
      form: {
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        message: "Your message",
        send: "Send",
        sending: "Sending …",
        success: "Thank you, your message is on its way. I'll be in touch soon.",
        error: "Something went wrong. Please try again later or email info@gerics.ch directly.",
      },
    },
    footer: {
      rights: "All rights reserved.",
      imagesCopyright: "All images are protected by copyright.",
      impressum: "Legal notice",
      privacy: "Privacy",
      builtBy: "Built by",
    },
    legal: {
      impressumTitle: "Legal notice",
      privacyTitle: "Privacy",
      updated: "Last updated: August 2026",
      backHome: "Back to home",
      sections: {
        impressum: [
          {
            h: "Responsible",
            p: "Ger𝓲cs — Mahmoud-Geri Geranmayeh\nStettfurterstrasse 4b\nCH-9548 Matzingen\nEmail: info@gerics.ch",
          },
          {
            h: "Image copyright",
            p: "All photographs and images shown on this website are protected by copyright and are the property of Ger𝓲cs. Any use, reproduction, modification, distribution or publication, in whole or in part, is prohibited without prior express written consent. Violations will be prosecuted.",
          },
          {
            h: "Disclaimer",
            p: "The content of this website is created with the greatest possible care. No guarantee is given for its accuracy, completeness or timeliness. The operators of external linked sites are solely responsible for their content.",
          },
        ],
        privacy: [
          {
            h: "Data controller",
            p: "The controller for data processing is Ger𝓲cs, info@gerics.ch. We comply with the Swiss Data Protection Act (revDSG).",
          },
          {
            h: "What data we process",
            p: "This website uses Google Analytics (Google Ireland Ltd.) to analyse visitor numbers and page views in anonymised form in order to improve the site. Technical data (e.g. shortened IP address, browser type, device, pages viewed) is processed and transferred to Google, partly to the USA. Further personal data only arises if you contact us by email; we use it solely to answer your enquiry.",
          },
          {
            h: "Cookies",
            p: "A technically necessary cookie is set for your language choice (German/English). Google Analytics additionally sets cookies for audience measurement. You can block or delete cookies in your browser at any time; you can also prevent collection by Google using its browser add-on.",
          },
          {
            h: "Server logs",
            p: "When the site is accessed, the hosting provider may log technical access data (e.g. IP address, time, page requested). This serves secure operation and is not combined with other data.",
          },
          {
            h: "Your rights",
            p: "You have the right to information about, correction and deletion of the data we hold about you. To exercise these rights, contact info@gerics.ch.",
          },
        ],
      },
    },
  },
};

export function t(lang: Lang): Dict {
  return dict[lang];
}
