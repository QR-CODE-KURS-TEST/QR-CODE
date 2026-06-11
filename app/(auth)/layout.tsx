import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Formular-Seite */}
      <div className="flex flex-col gap-8 p-6 md:p-10">
        <Link href="/" className="w-fit">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      {/* Brand-Panel (nur Desktop) */}
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex h-full flex-col justify-end gap-6 p-12 text-primary-foreground">
          <blockquote className="text-2xl font-semibold leading-snug tracking-tight">
            „Ein QR-Code. Tausende Scans. Und endlich Daten, mit denen ich
            arbeiten kann."
          </blockquote>
          <p className="text-sm text-primary-foreground/70">
            {APP_NAME} — designe QR-Codes, kürze Links und tracke jeden Scan in
            Echtzeit.
          </p>
        </div>
      </div>
    </div>
  );
}
