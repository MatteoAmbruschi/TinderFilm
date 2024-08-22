import { cn } from '@/lib/utils';
import { motion, Transition } from 'framer-motion';
import { Children, cloneElement, ReactElement, useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation'


type AnimatedBackgroundProps = {
    children: ReactElement<any> | ReactElement<any>[];
    defaultValue?: string;
    onValueChange?: (newActiveId: string | null) => void;
    className?: string;
    transition?: Transition;
    enableHover?: boolean;
};

export default function AnimatedBackground({
    children,
    defaultValue,
    onValueChange,
    className,
    transition,
    enableHover = false,
}: AnimatedBackgroundProps) {
  const params = usePathname()
  const selected = params?.replace('/', '').toUpperCase() || '';

    const [activeId, setActiveId] = useState<string | null>(null);
    const [position, setPosition] = useState<{ left: number; width: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updatePosition = (element: HTMLElement) => {
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            setPosition({
                left: elementRect.left - containerRect.left,
                width: elementRect.width,
            });
        }
    };

    const handleSetActiveId = (id: string | null, element: HTMLElement | null) => {
        setActiveId(id);
        if (element) {
            updatePosition(element);
        }
        if (onValueChange) {
            onValueChange(id);
        }
    };

    function selectUrl () {
        const lobbyRegex = /^LOBBY\/\d+$/;
        if(selected === '' || lobbyRegex.test(selected)) {
            return 'LOBBY'
        } else if (selected === 'MATCH') {
            return 'MATCH'
        } else {
            return 'MOVIE'
        }
    }

    useEffect(() => {
        if (selected !== undefined) {
            const defaultElement = document.querySelector(`[data-id='${selectUrl()}']`);
            if (defaultElement instanceof HTMLElement) {
                handleSetActiveId(selected, defaultElement);
            }
        }
    }, [selected]);

    return (
        <div ref={containerRef} className="relative">
            {Children.map(children, (child, index) => {
                const id = child.props['data-id'];

                const interactionProps = enableHover
                    ? {
                          onMouseEnter: (e: React.MouseEvent) => handleSetActiveId(id, e.currentTarget as HTMLElement),
                          onMouseLeave: () => handleSetActiveId(null, null),
                      }
                    : {
                          onClick: (e: React.MouseEvent) => handleSetActiveId(id, e.currentTarget as HTMLElement),
                      };

                return cloneElement(
                    child,
                    {
                        key: index,
                        className: cn('relative inline-flex', child.props.className),
                        'aria-selected': activeId === id,
                        'data-checked': activeId === id ? 'true' : 'false',
                        ...interactionProps,
                    },
                    <>
                        {child.props.children}
                    </>
                );
            })}
            {position && (
                <motion.div
                    className={cn('absolute top-0 h-full', className)}
                    style={{
                        left: position.left,
                        width: position.width,
                    }}
                    transition={transition}
                    initial={{ opacity: defaultValue ? 1 : 0 }}
                    animate={{
                        left: position.left,
                        width: position.width,
                    }}
                />
            )}
        </div>
    );
}
