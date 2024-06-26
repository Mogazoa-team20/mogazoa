import type { Metadata } from "next";
import localFont from "next/font/local";
import { getServerSession } from "next-auth/next";
import { FloatingButton } from "@/components/FloatingButton";
import { Gnb } from "@/components/Gnb";
import authOptions from "@/lib/auth";
import AuthProvider from "@/lib/AuthProvider";
import KakaoScript from "@/lib/KakaoScript";
import Providers from "@/lib/Providers";
import "@/styles/_reset.scss";
import "@/styles/_common.scss";
import { META } from "@/utils/metadata";
import styles from "./RootLayout.module.scss";

export const metadata: Metadata = META;

const pretendard = localFont({
  src: "../../public/fonts/Pretendard-Regular.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html
      lang='ko'
      className={pretendard.className}
    >
      <body className={styles.container}>
        <div id='modal' />
        <AuthProvider>
          <Providers>
            <Gnb initialSession={session} />
            <main className={styles.main}>{children}</main>
            <FloatingButton initialSession={session} />
          </Providers>
        </AuthProvider>
        <div id='toast' />
        <KakaoScript />
      </body>
    </html>
  );
}
