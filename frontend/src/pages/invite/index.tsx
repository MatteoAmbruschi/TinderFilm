import * as React from "react"
import { useEffect, useState } from "react"
import axios from 'axios';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/router";
import { useSearchParams } from 'next/navigation'
import styles from '@/styles/card.module.css'
import { setCookie } from "@/components/cookies/Cookies";

function Invite({setIdApp, className, setIdUser}: {setIdApp: any, className: string, setIdUser: any}) {
        const [nickName, setNickName] = useState<any>('')
        const router = useRouter()
        const searchParams = useSearchParams()

        const createNewLobby = async () => {
          try{
            const data = {
              name: nickName,
              lobby_id: searchParams.get("lobby")
            };
      
            await axios.post(process.env.NEXT_PUBLIC_BACKEND + '/acceptInvite', data)
            .then((response) => {
                if(response.status === 200) {
                    const cookies = {lobbyId: searchParams.get("lobby"), idUser: response.data.id}
                    setCookie(cookies)

                    setIdApp(searchParams.get("lobby"))
                    setIdUser(response.data.id)
                    router.push(`/${response.data.lobby_id}`)
                    console.log(response)
                }
            }).catch((error) => {
              console.log(error, 'error!')
            })
          }
          catch(error) {
            console.log(error)
          }
        }
        
        return (
        <div className={`${styles.card} ${className}`}>
          <Card className="w-1/3 min-w-60">
            <CardHeader>
              <CardTitle>Accept the invite</CardTitle>
              <CardDescription>You need to choose a nickname.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name"
                      placeholder="Your nickname"
                      value={nickName}
                      onChange={(e) => setNickName(e.target.value)}
                      />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col justify-between">
              <Button className="w-full" onClick={createNewLobby} disabled={!nickName}>PLAY</Button>
            </CardFooter>
          </Card>
        </div>
        )
}

export default Invite