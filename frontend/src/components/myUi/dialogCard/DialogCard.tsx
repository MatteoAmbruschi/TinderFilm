import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogImage,
    DialogSubtitle,
    DialogClose,
    DialogDescription,
    DialogContainer,
  } from '@/components/myUi/Dialog';
  import { PlusIcon } from 'lucide-react';
  import { ScrollArea } from '@/components/ui/scroll-area';
  
  export function DialogBasicOne({movie}: {movie: any}) {
    return (
      <Dialog
        transition={{
          type: 'spring',
          bounce: 0.05,
          duration: 0.25,
        }}
      >
        <div
          style={{
            borderRadius: '12px',
            pointerEvents: 'none'
          }}
          className='flex flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900'
        >
          <DialogImage
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            alt={movie.overview}
            className='h-[346px] w-full object-cover'
          />
          <div className='flex flex-grow flex-row items-end justify-between p-2 h-[90px]'>
            <div>
              <DialogTitle className='text-zinc-950 dark:text-zinc-50 leading-4 pb-1'>
                {movie.title}
              </DialogTitle>
              <DialogSubtitle className='text-zinc-700 dark:text-zinc-400'>
              Rating: {movie.vote_average}
              </DialogSubtitle>
            </div>
            <DialogTrigger
            style={{ pointerEvents: 'auto' }}
            >
            <button
              type='button'
              className='relative ml-1 flex h-12 w-12 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-500'
              aria-label='Open dialog'
            >
              <PlusIcon size={20} />
            </button>
            </DialogTrigger>
          </div>
        </div>
        <DialogContainer>
          <DialogContent
            style={{
              borderRadius: '24px',        
            }}
            className='pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[500px]'
          >
            <ScrollArea className='h-[90vh]' type='scroll'>
            <DialogImage
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt='A desk lamp designed by Edouard Wilfrid Buquet in 1925. It features a double-arm design and is made from nickel-plated brass, aluminium and varnished wood.'
              className='h-auto object-cover w-full'
            />
            <div className='p-6'>
              <DialogTitle className='text-2xl text-zinc-950 dark:text-zinc-50'>
                {movie.title}
              </DialogTitle>
              <DialogSubtitle className='text-zinc-700 dark:text-zinc-400'>
              Rating: {movie.vote_average} &nbsp;&nbsp;&nbsp;  Date: {movie.release_date}
              </DialogSubtitle>
              <DialogDescription
                disableLayoutAnimation
                variants={{
                  initial: { opacity: 0, scale: 0.8, y: 100 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.8, y: 100 },
                }}
              >
                <p className='mt-2 text-zinc-500 dark:text-zinc-500'>
                    {movie.overview}
                </p>
              </DialogDescription>
            </div>
            </ScrollArea>
            <DialogClose className='text-zinc-50' />
          </DialogContent>
        </DialogContainer>
      </Dialog>
    );
  }
  