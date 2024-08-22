import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Menu } from "@/components/menu/Menu";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [idApp, setIdApp] = useState<any>(null)
  console.log(idApp)

  return (
  <>
    <Menu className={`${inter.className}`} idApp={idApp}></Menu>
     <Component {...pageProps} idApp={idApp} setIdApp={setIdApp} />
  </>
);
}
