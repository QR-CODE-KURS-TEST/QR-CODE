import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <>
      <h1>Impressum</h1>
      <p className="text-xs">
        Platzhalter – die finalen Angaben werden vor dem Launch ergänzt (Phase 6).
      </p>

      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        [Firmenname]
        <br />
        [Straße &amp; Hausnummer]
        <br />
        [PLZ &amp; Ort]
      </p>

      <h2>Vertreten durch</h2>
      <p>[Name der vertretungsberechtigten Person]</p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: [kontakt@deine-domain.de]
        <br />
        Telefon: [optional]
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>[USt-IdNr., falls vorhanden]</p>

      <h2>Verantwortlich für den Inhalt</h2>
      <p>[Name, Anschrift]</p>
    </>
  );
}
