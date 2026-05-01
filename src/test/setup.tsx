import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// jsdom doesn't implement scrollIntoView — provide a no-op
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock Next.js Link as a plain anchor
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => React.createElement("a", { href, ...props }, children),
}));

// Framer-motion props that must be stripped before passing to DOM elements
const FRAMER_PROPS = new Set([
  "initial", "animate", "exit", "transition", "variants",
  "whileHover", "whileTap", "whileFocus", "whileInView", "whileDrag",
  "layout", "layoutId", "drag", "dragConstraints", "dragElastic",
  "dragMomentum", "onDragStart", "onDragEnd", "onAnimationStart",
  "onAnimationComplete", "custom", "transformTemplate",
]);

// Semantic HTML tags that should be preserved as-is
const SEMANTIC_TAGS = new Set([
  "button", "a", "section", "article", "nav", "header", "footer",
  "main", "aside", "form", "fieldset", "label", "input", "textarea",
  "select", "ul", "ol", "li", "table", "thead", "tbody", "tr", "td", "th",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "span",
]);

function createMotionComponent(tag: string) {
  const htmlTag = SEMANTIC_TAGS.has(tag) ? tag : "div";

  return function MotionComponent({
    children,
    ...allProps
  }: React.HTMLAttributes<HTMLElement> & { [key: string]: unknown }) {
    // Strip framer-specific props
    const domProps: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(allProps)) {
      if (!FRAMER_PROPS.has(key)) {
        domProps[key] = value;
      }
    }
    return React.createElement(htmlTag, domProps, children);
  };
}

vi.mock("framer-motion", () => ({
  motion: new Proxy({} as Record<string, unknown>, {
    get(_target, prop: string) {
      return createMotionComponent(prop);
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useMotionValue: (initial: unknown) => ({ get: () => initial, set: vi.fn() }),
  useTransform: () => ({ get: vi.fn() }),
}));
