import AnimatedBackground from "@/components/myUi/animated-background/AnimateBackground";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SegmentedControlProps {
    items: string[];
    idApp:any
  }

export function SegmentedControl(items: SegmentedControlProps) {
  const params = usePathname()
  const selected = params?.replace('/', '').toUpperCase() || '';


  return (
    <div className='rounded-[8px] p-[2px] dark:bg-zinc-800 bg-zinc-700'>
      <AnimatedBackground
        defaultValue={items.items[0]}
        className='rounded-lg bg-zinc-500 dark:bg-zinc-700'
        transition={{
          ease: 'easeInOut',
          duration: 0.2,
        }}
      >
        {items.items.map((label, index) => {
            
            const baseHref = label === 'LOBBY' ? '/' : `/${label.toLowerCase()}`
            const hrefWithIdApp = label === 'LOBBY' ? `/lobby/${items.idApp}` : label === 'MOVIE' ? `/${items.idApp}` : `/match` ;

          return (
            <Link
              key={index}
              data-id={label}
              defaultValue={selected}
              href={items.idApp ? hrefWithIdApp : baseHref}
              className='relative z-10 inline-flex w-28 items-center justify-center text-center text-zinc-50 transition-transform active:scale-[0.93] dark:text-zinc-50'
            >
              {label}
            </Link>
          );
        })}
      </AnimatedBackground>
    </div>
  );
}
