import * as React from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Dialog, DialogImage } from "../Dialog"


export function DrawerDemo({isOpen, onClose, setMatchAlert, matchAlert}: {isOpen: any, onClose: any, setMatchAlert: any, matchAlert: any}) {
  const [goal, setGoal] = React.useState(350)
  const [closing, setClosing] = React.useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 500); // Imposta questo valore al tempo dell'animazione di chiusura in ms
  };

  console.log(matchAlert)
  return (
    <Drawer open={isOpen && !closing} onOpenChange={handleClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
                



                <Image
                src={`https://image.tmdb.org/t/p/original/${matchAlert.poster_path}`}
                alt={matchAlert.overview}
                className='h-[346px] w-full object-cover'
                width={600}
                height={600}
            />
 
            </DrawerTitle>
            <DrawerDescription>{matchAlert.overview}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex-1 text-center">
                <div className="text-5xl font-bold tracking-tighter pb-3">
                  {matchAlert.title}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                vote: {matchAlert.vote_average} &nbsp;&nbsp;&nbsp; date: {matchAlert.release_date}
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={onClose} className="bg-red-800 hover:bg-red-950">CLOSE</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
