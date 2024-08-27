'use client';
import CheckMatch from '@/components/checkMatch/CheckMatch';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
  CarouselNavigation
} from '@/components/ui/carousel'

function CarouselMP({ className, idApp, idUser }: { className: string, idApp: any, idUser: any }) {

  const ITEMS = new Array(4).fill(null).map((_, index) => index + 1);
  const { index, setIndex, itemsCount } = useCarousel();

  return (
    <div className={className}>
      <CarouselContent className='relative'>
        {ITEMS.map((item) => {
          return (
            <CarouselItem key={item} className='p-4'>
              <div className='flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800'>
                {item}
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className='flex w-full justify-center space-x-3 px-4'>
        {ITEMS.map((item) => {
          return (
            <button
              key={item}
              type='button'
              aria-label={`Go to slide ${item}`}
              onClick={() => setIndex(item - 1)}
              className='h-12 w-12 border border-zinc-200 dark:border-zinc-800'
            >
              {item}
            </button>
          );
        })}
      </div>
      <CarouselNavigation alwaysShow />
    </div>
  );
}

export function CarouselCustomIndicator({className, idApp, idUser}: {className: string, idApp: any, idUser: any}) {
  return (
    <div className='relative w-full max-w-xs py-8'>
      <Carousel>
        <CarouselMP className={className} idApp={idApp} idUser={idUser} />
      </Carousel>
    </div>
  );
}
