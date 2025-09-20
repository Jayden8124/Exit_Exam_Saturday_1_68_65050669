// app/layout.tsx
import "./globals.css";
import { cookies } from "next/headers"; // ⭐ เพิ่ม
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = cookies().get("userId")?.value; // ⭐ อ่าน cookie ฝั่ง server

  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              Computer Science Crowdfunding
            </Link>
            <nav className="nav">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/stats" className="nav-link">
                Stats
              </Link>
              {userId ? (
                <form
                  action="/api/auth/logout"
                  method="post"
                  style={{ display: "inline" }}
                >
                  <button
                    type="submit"
                    className="nav-link"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </form>
              ) : (
                <Link href="/login" className="nav-link">
                  Login
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main className="container content">{children}</main>
        <footer className="site-footer">
          <div className="container">
            © {new Date().getFullYear()} Phakkhaphon Saekow
          </div>
        </footer>
      </body>
    </html>
  );
}
