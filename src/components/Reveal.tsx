import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Kept for call-site compatibility; content no longer animates in on scroll. */
  delay?: number;
  as?: "div" | "section" | "li";
}

/**
 * Section wrapper. It used to fade each block in on scroll with a stagger;
 * that is gone on purpose: the route-level fade in Layout is the page's one
 * entrance, and a firm's site should read as settled print, not a show.
 */
export default function Reveal({ children, className = "", as: Tag = "div" }: RevealProps) {
  return <Tag className={className}>{children}</Tag>;
}
