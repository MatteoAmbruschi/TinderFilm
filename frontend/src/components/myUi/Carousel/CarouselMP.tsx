'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
  CarouselNavigation
} from '@/components/ui/carousel'
import { DialogBasicOne } from '../dialogCard/DialogCard';

function CarouselMP({ className, idApp, idUser, match }: { className: string, idApp: any, idUser: any, match: Array<any> }) {
  const ITEMS = new Array(4).fill(null).map((_, index) => index + 1);

  console.log(match)
  const { index, setIndex, itemsCount } = useCarousel();
  return (
    <div className={className}>
      <CarouselContent className='relative'>
        {match.map((movie) => {
          return (
            <CarouselItem key={movie.id} className='p-4'>
              <div className='flex aspect-square items-center justify-center'>
                <DialogBasicOne movie={movie} />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className='flex w-full justify-center space-x-3 px-4'>
        {match.map((movie, index) => {
          return (
            <button
              key={movie.id}
              type='button'
              aria-label={`Go to slide ${movie.id}`}
              onClick={() => setIndex(index)}
              className='h-12 w-12 border border-zinc-200 dark:border-zinc-800'
            >
              {movie.vote_average}
            </button>
          );
        })}
      </div>
      <CarouselNavigation alwaysShow />
    </div>
  );
}

export function CarouselCustomIndicator({className, idApp, idUser, match}: {className: string, idApp: any, idUser: any, match: any}) {
  return (
    <div className='relative w-full max-w-xs py-8'>
      <Carousel>
        <CarouselMP className={className} idApp={idApp} idUser={idUser} match={match} />
      </Carousel>
    </div>
  );
}
