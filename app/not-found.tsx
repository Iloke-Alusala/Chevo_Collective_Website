import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-chevo-bg px-6">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-chevo-muted-text">
          Oops! Page not found
        </p>
        <Link href="/" className="text-chevo-red underline hover:opacity-80">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
