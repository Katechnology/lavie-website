import type { Metadata, Viewport } from "next";
import { Roboto_Mono, Roboto_Serif, Shippori_Mincho } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const robotoSerif = Roboto_Serif({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  axes: ["wdth", "opsz", "GRAD"],
  variable: "--font-roboto-serif",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const shippori = Shippori_Mincho({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lavie.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lavie — Dạy tiếng Nhật N5–N2 tại Huế",
  description:
    "Học tiếng Nhật cùng Lavie: kèm 1-1 online, trực tiếp tại Huế, nhóm nhỏ và luyện thi JLPT từ N5 đến N2. Đăng ký học thử miễn phí.",
  applicationName: "Lavie 日本語",
  keywords: [
    "học tiếng Nhật Huế",
    "gia sư tiếng Nhật Huế",
    "luyện thi JLPT",
    "tiếng Nhật N5",
    "tiếng Nhật N4",
    "tiếng Nhật N3",
    "tiếng Nhật N2",
    "học tiếng Nhật online",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Lavie 日本語",
    title: "Lavie — Tiếng Nhật, nở hoa.",
    description: "Dạy tiếng Nhật N5–N2 tại Huế · 1-1 online, trực tiếp, nhóm nhỏ, luyện thi JLPT.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Cây anh đào bên dòng Hương — Lavie 日本語" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0d0b0a",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Lavie 日本語",
  description: "Dạy tiếng Nhật từ N5 đến N2 tại Huế: 1-1 online, trực tiếp, nhóm nhỏ, luyện thi JLPT.",
  telephone: site.contact.phoneIntl,
  address: { "@type": "PostalAddress", addressLocality: "Huế", addressCountry: "VN" },
  areaServed: ["Huế", "Việt Nam", "Online"],
  founder: { "@type": "Person", name: "Lavie", jobTitle: "Giáo viên tiếng Nhật" },
  knowsLanguage: ["ja", "vi"],
  url: siteUrl,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${robotoSerif.variable} ${robotoMono.variable} ${shippori.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
