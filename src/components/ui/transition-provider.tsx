"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
  type MouseEvent,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Link, { type LinkProps } from "next/link";
import gsap from "gsap";

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

interface TransitionContextValue {
  /** Trigger an exit animation then navigate to `href` */
  navigateTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigateTo: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  /* ---- Enter animation (runs on every pathname change) ---- */
  const lastPath = useRef(pathname);
  // We use a layout-effect-like approach via GSAP's onComplete
  // but for the enter animation we rely on the content wrapper mounting

  const navigateTo = useCallback(
    (href: string) => {
      // Skip if already animating or navigating to the same page
      if (isAnimating.current) return;
      if (href === pathname) return;

      isAnimating.current = true;
      const el = contentRef.current;

      if (!el) {
        router.push(href);
        isAnimating.current = false;
        return;
      }

      // Exit animation
      gsap.to(el, {
        opacity: 0,
        y: -12,
        scale: 0.99,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          router.push(href);

          // After a brief delay for the new route to render, play enter
          requestAnimationFrame(() => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 18, scale: 0.99 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                ease: "power2.out",
                delay: 0.05,
                onComplete: () => {
                  isAnimating.current = false;
                },
              }
            );
          });
        },
      });
    },
    [pathname, router]
  );

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      <div ref={contentRef} className="flex flex-col flex-1">
        {children}
      </div>
    </TransitionContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  TransitionLink — drop-in <Link> replacement                       */
/* ------------------------------------------------------------------ */

interface TransitionLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  /** Pass-through HTML attributes */
  [key: string]: unknown;
}

export function TransitionLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const { navigateTo } = usePageTransition();
  const hrefString = typeof href === "string" ? href : href.pathname ?? "/";

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Let modifier-key clicks behave normally (new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    onClick?.(e);
    navigateTo(hrefString);
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
