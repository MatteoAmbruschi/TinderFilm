import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import styles from "@/styles/card.module.css"
import { useRouter } from "next/router"


function LobbyId({setIdApp, idApp}: {idApp: any, setIdApp: any}) {
  const router = useRouter()

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/invite?lobby=${idApp}`);
    } catch (err) {
      console.log('Failed to copy: ', err)
    }
  }

  const deleteLobby = async () => {
    setIdApp(null);
    router.push('/');
    return;
  }

  
  return (
    <div className={styles.card}>
      <Card className="w-1/3 min-w-60">
        <CardHeader>
          <CardTitle>Copy Link</CardTitle>
          <CardDescription>You can share the link to play.</CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col justify-between">
        <Button className="w-full" onClick={copyUrl}>COPY LINK</Button>
        or
          <Button variant="secondary" className="w-full" onClick={deleteLobby}>CLOSE LOBBY</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LobbyId