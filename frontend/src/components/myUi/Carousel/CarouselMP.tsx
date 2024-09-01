'use client';
import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
} from '@/components/ui/carousel';
import { DialogBasicOne } from '../dialogCard/DialogCard';

function CarouselMP({ className, idApp, idUser, match }: { className: string, idApp: any, idUser: any, match: Array<any> }) {

  console.log(match)
  return (
    <div className={className}>
      <CarouselContent className='relative'>
        {match.map((movie, index) => (
            <CarouselItem key={movie.id} className='p-4'>
              <div className='flex aspect-square items-center justify-center'>
                <DialogBasicOne movie={movie} />
              </div>
            </CarouselItem>
          )
        )}
      </CarouselContent>
      <CarouselNavigation alwaysShow />
      <CarouselIndicator />
    </div>
  );
}

export function CarouselCustomIndicator({className, idApp, idUser, match}: {className: string, idApp: any, idUser: any, match: any}) {
  return (
    <div className='relative w-full max-w-xs'>
      <Carousel>
        <CarouselMP className={className} idApp={idApp} idUser={idUser} match={match} />
      </Carousel>
    </div>
  );
}
