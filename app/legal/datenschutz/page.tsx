import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function DatenschutzPage() {
  return (
    <>
      <h1>Datenschutzerklärung</h1>
      <p className="text-xs">
        Platzhalter – die finale, juristisch geprüfte Fassung wird vor dem Launch
        ergänzt (Phase 6).
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>[Firmenname, Anschrift, Kontakt] – siehe Impressum.</p>

      <h2>2. Konto &amp; Authentifizierung</h2>
      <p>
        Zur Nutzung der App speichern wir deine E-Mail-Adresse und Profildaten.
        Authentifizierung und Datenhaltung erfolgen über Supabase.
      </p>

      <h2>3. Scan-Tracking</h2>
      <p>
        Bei getrackten QR-Codes erfassen wir pro Scan Zeitpunkt, grobe
        Geo-Information, Geräte-/Browsertyp und einen <em>gehashten</em>{" "}
        IP-Wert. Es werden keine Cookies gesetzt und keine personenbezogenen
        Daten gespeichert.
      </p>

      <h2>4. Zahlungsabwicklung</h2>
      <p>
        Zahlungen werden über Stripe abgewickelt. Es gelten zusätzlich die
        Datenschutzbestimmungen von Stripe.
      </p>

      <h2>5. Deine Rechte</h2>
      <p>
        Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und
        Datenübertragbarkeit. Kontakt: [datenschutz@deine-domain.de].
      </p>
    </>
  );
}
