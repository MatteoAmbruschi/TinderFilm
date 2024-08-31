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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { setCookie } from "@/components/cookies/Cookies";

export function CardWithForm({ setIdApp, setIdUser }: {setIdApp: any, setIdUser: any}) {
  const [movieTypes, setMovieTypes] = useState<Array<{ id: number, name: string }>>([]);
  const path = usePathname()
  const [movieSelected, setMovieSelected] = useState<{ id: number, name: string }>()
  const [nickName, setNickName] = useState<any>('')
  const router = useRouter()

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_BACKEND + '/getMovieTypes')
    .then((response) => {
      if(response.status === 200) {
        setMovieTypes(response.data.genres)
        console.log(response.data.genres)
      } else {
        setMovieTypes([]);
        console.log('Error fetching movie types:', response.status);
      }
    }).catch((error) => {
      setMovieTypes([]);
      console.log(error)
    })
  }, [])


  const createNewLobby = async () => {
    try{
      const data = {
        name: nickName,
        type: movieSelected?.name,
        type_id: movieSelected?.id
      };

      await axios.post(process.env.NEXT_PUBLIC_BACKEND + '/lobby', data, {
        withCredentials: true
      })
      .then((response) => {
        if(response.status === 200) {
          const cookies = {lobbyId: response.data.lobby_id, idUser: response.data.id}
          setCookie(cookies)
          router.push(`/lobby/${response.data.lobby_id}`);
          setIdApp(response.data.lobby_id)
          setIdUser(response.data.id)
        }
      }).catch((error) => {
        console.log(error, 'error!')
      })
    }
    catch(error) {
      console.log(error)
    }
  }

  console.log(movieSelected)
  return (
    <Card className="w-1/3 min-w-60">
      <CardHeader>
        <CardTitle>Create your lobby</CardTitle>
        <CardDescription>You can share the link once is created.</CardDescription>
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
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Movie Type</Label>
              <Select onValueChange={(value) => setMovieSelected(movieTypes.find((type) => type.name === value))}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {
                    movieTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col justify-between">
        <Button className="w-full" onClick={createNewLobby} disabled={!movieSelected || !nickName}>CREATE</Button>
      </CardFooter>
    </Card>
  )
}
