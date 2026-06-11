import type { Metadata } from "next";

export const metadata: Metadata = { title: "AGB" };

export default function AgbPage() {
  return (
    <>
      <h1>Allgemeine Geschäftsbedingungen</h1>
      <p className="text-xs">
        Platzhalter – die finale Fassung wird vor dem Launch ergänzt (Phase 6).
      </p>

      <h2>1. Geltungsbereich</h2>
      <p>
        Diese AGB gelten für die Nutzung der Scanvio-Plattform zur Erstellung,
        Verwaltung und Auswertung von QR-Codes.
      </p>

      <h2>2. Leistungen</h2>
      <p>
        Umfang und Grenzen richten sich nach dem gewählten Tarif (Free, Pro,
        Business).
      </p>

      <h2>3. Vertragslaufzeit &amp; Kündigung</h2>
      <p>
        Kostenpflichtige Abos sind monatlich oder jährlich und jederzeit zum
        Laufzeitende kündbar.
      </p>

      <h2>4. Pflichten der Nutzer</h2>
      <p>
        QR-Codes dürfen nicht für rechtswidrige Inhalte oder Ziele verwendet
        werden.
      </p>

      <h2>5. Haftung</h2>
      <p>[Haftungsregelungen werden ergänzt.]</p>
    </>
  );
}
