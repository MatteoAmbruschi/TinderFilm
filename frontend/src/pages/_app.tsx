import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Menu } from "@/components/menu/Menu";
import { useEffect, useState } from "react";
import socketIO from "socket.io-client";
import Lottie from 'react-lottie';

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [idApp, setIdApp] = useState<any>(null)
  const [idUser, setIdUser] = useState<any>(null)
  const [matchAlert, setMatchAlert] = useState<any>(null)
  
  useEffect(() => {
    const socketInstance = socketIO(process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:3000', {
        transports: ['websocket'], // Forza il trasporto WebSocket
    });
  
    socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
        socketInstance.emit('join_lobby', idApp);
    });
  
    socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
    });
  
    socketInstance.on('connect_error', (err) => {
        console.error('Connection error:', err);
    });
  
    socketInstance.on('match_update', (data) => {
        console.log('Match updated:', data.match);
        setMatchAlert(data.match)
    });
  
    socketInstance.on('test_event', (data) => {
      console.log('Test event received:', data.message);
  });
  
    return () => {
        socketInstance.disconnect();
    };
  }, [idApp]);

  return (
  <>
    <Menu className={`${inter.className}`} idApp={idApp}></Menu>
     <Component className={`${inter.className}`} {...pageProps} idApp={idApp} setIdApp={setIdApp} idUser={idUser} setIdUser={setIdUser} />

     <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script> 

    <dotlottie-player src="https://lottie.host/8966acfa-48f7-4e64-8eb2-e89e211b98d7/CkE5R3MgYY.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>
  </>
);
}
