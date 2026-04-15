"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    const el = contentRef.current;
    if (!el) {
      isAnimating.current = false;
      return;
    }

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
  }, [pathname]);

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

      // Exit animation — enter is handled by useEffect on pathname change
      gsap.to(el, {
        opacity: 0,
        y: -12,
        scale: 0.99,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          router.push(href);
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

  // Build full href string, preserving search & hash from UrlObject
  const hrefString =
    typeof href === "string"
      ? href
      : `${href.pathname ?? "/"}${href.search ? `?${href.search}` : ""}${
          href.hash ? `#${href.hash}` : ""
        }`;

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Let modifier-key clicks behave normally (new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Respect already-prevented events
    if (e.defaultPrevented) return;

    // Skip for target or download attributes
    const anchor = e.currentTarget;
    if (anchor.getAttribute("target") && anchor.getAttribute("target") !== "_self") return;
    if (anchor.hasAttribute("download")) return;

    // Skip for external URLs
    try {
      const url = new URL(hrefString, window.location.origin);
      if (url.origin !== window.location.origin) return;
    } catch {
      return;
    }

    // Let onClick handler cancel navigation via preventDefault
    onClick?.(e);
    if (e.defaultPrevented) return;

    e.preventDefault();
    navigateTo(hrefString);
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
