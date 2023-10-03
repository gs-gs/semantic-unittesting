import Context from "@/Context";
import "./globals.css";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <Context>
          <header className="bg-blue-500 h-12 px-4 flex flex-col justify-center">
            <div className="flex justify-between">
              <Link href="/" className="font-bold text-white self-center">
                Semantic Unit Testing
              </Link>
            </div>
          </header>
          {children}
        </Context>
      </body>
    </html>
  );
}
