"use client";

import { forwardRef } from "react";
import { NavLink as RouterNavLink, type NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, ...props }, ref) => (
    <RouterNavLink
      ref={ref}
      className={({ isActive, isPending }) =>
        cn(
          className,
          isActive && activeClassName,
          isPending && pendingClassName,
        )
      }
      {...props}
    />
  ),
);

NavLink.displayName = "NavLink";

export { NavLink };
export type { NavLinkCompatProps };