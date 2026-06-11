import { Button } from "@/components/ui/button";
import { oauthGoogle, oauthApple } from "@/app/(auth)/actions";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M16.36 12.6c.03 2.9 2.54 3.86 2.57 3.87-.02.07-.4 1.38-1.33 2.72-.8 1.17-1.64 2.33-2.96 2.35-1.3.03-1.72-.77-3.2-.77-1.49 0-1.95.75-3.18.8-1.27.05-2.24-1.26-3.05-2.42-1.65-2.4-2.91-6.77-1.22-9.73.84-1.46 2.34-2.39 3.97-2.41 1.25-.03 2.43.84 3.2.84.76 0 2.2-1.04 3.7-.89.63.03 2.4.26 3.54 1.92-.09.06-2.11 1.24-2.08 3.7M14 4.15c.68-.83 1.14-1.97.99-3.12-.99.04-2.18.66-2.88 1.48-.63.73-1.18 1.9-1.03 3.02 1.1.09 2.24-.56 2.92-1.38" />
    </svg>
  );
}

export function OAuthButtons() {
  return (
    <div className="grid gap-3">
      <form action={oauthGoogle}>
        <Button type="submit" variant="outline" className="w-full" size="lg">
          <GoogleIcon />
          Mit Google fortfahren
        </Button>
      </form>
      <form action={oauthApple}>
        <Button type="submit" variant="outline" className="w-full" size="lg">
          <AppleIcon />
          Mit Apple fortfahren
        </Button>
      </form>
    </div>
  );
}
