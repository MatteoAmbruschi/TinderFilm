import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Menu } from "@/components/menu/Menu";
import { useEffect, useState } from "react";
import socketIO from "socket.io-client";
import Lottie from "react-lottie";
import hearts from "@/components/lotties/hearts.json";
import { DrawerDemo } from "@/components/myUi/drawer/Drawer";
import { readCookie } from "@/components/cookies/Cookies";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [idApp, setIdApp] = useState<any>(null);
  const [idUser, setIdUser] = useState<any>(null);
  const [matchAlert, setMatchAlert] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [lottie, setLottie] = useState<boolean>(false);
  
  const router = useRouter()
  const path = usePathname()

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: hearts,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const eventListeners = [
    {
      eventName: "complete" as const,
      callback: () => setLottie(false),
    },
  ];

  useEffect(() => {
    const socketInstance = socketIO(
      process.env.NEXT_PUBLIC_BACKEND || "https://tinderfilm.onrender.com",
      {
        transports: ["websocket"], // Forza il trasporto WebSocket
      }
    );

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      socketInstance.emit("join_lobby", idApp);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socketInstance.on("match_update", (data) => {
      console.log("Match updated:", data.match);
      setLottie(true);
      setMatchAlert(data.match);
      setIsDrawerOpen(true);
      /* alert(`New match: ${data.match}`); */
    });

    socketInstance.on("test_event", (data) => {
      console.log("Test event received:", data.message);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [idApp]);

  useEffect(() => {
    if (!matchAlert) {
      setIsDrawerOpen(false);
    }
  }, [matchAlert]);


  useEffect(() => {
    path !=='/invite' ? readCookie(setIdApp, setIdUser, router) : ''
  }, [])

  console.log(path)

  return (
    <>
      <Menu
        className={`${inter.className}`}
        idApp={idApp}
      ></Menu>
      <Component
        className={`${inter.className}`}
        {...pageProps}
        idApp={idApp}
        setIdApp={setIdApp}
        idUser={idUser}
        setIdUser={setIdUser}
      />

      {matchAlert ? (
        <div>
          <DrawerDemo setMatchAlert={setMatchAlert} matchAlert={matchAlert} isOpen={isDrawerOpen} onClose={() => setMatchAlert(null)} />
          {lottie && (
            <div className="lottie">
              <Lottie
                options={defaultOptions}
                eventListeners={eventListeners}
              />
            </div>
          )}
        </div>
      ) : "" }
    </>
  );
}
