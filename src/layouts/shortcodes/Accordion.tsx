"use client";

import React, { createContext, useContext, useState } from "react";

// Create a context to track the currently open accordion
const AccordionContext = createContext<{
  openAccordion: number | null;
  setOpenAccordion: React.Dispatch<React.SetStateAction<number | null>>;
}>({
  openAccordion: null,
  setOpenAccordion: () => { },
});

// Provider component to wrap around accordion groups
export const AccordionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  return (
    <AccordionContext.Provider value={{ openAccordion, setOpenAccordion }}>
      {children}
    </AccordionContext.Provider>
  );
};

// Counter for auto-generating IDs
let autoIdCounter = 0;

const Accordion = ({
  title,
  children,
  className,
  id: propId,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: number;
}) => {
  // Generate a unique ID if none is provided
  const [id] = React.useState(() => propId ?? autoIdCounter++);

  // Access the accordion context
  const { openAccordion, setOpenAccordion } = useContext(AccordionContext);
  // Determine if this accordion should be shown based on the context
  const isOpen = id === openAccordion;
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(isOpen ? "auto" : "0px");

  // Close on custom event (keeping this for backward compatibility)
  React.useEffect(() => {
    const handler = () => {
      if (isOpen) {
        setOpenAccordion(null);
      }
    };

    const eventName = `accordion:close-${id}`;
    window.addEventListener(eventName, handler);

    return () => window.removeEventListener(eventName, handler);
  }, [id, isOpen, setOpenAccordion]);

  // Update height when isOpen changes
  React.useEffect(() => {
    if (isOpen) {
      setHeight(`${contentRef.current?.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  // Toggle accordion open/closed
  const toggleAccordion = () => {
    setOpenAccordion(isOpen ? null : id ?? null);
  };

  return (
    <div
      className={`accordion ${className} ${isOpen && "border-dark/40"}`}
    >
      <button
        aria-expanded={isOpen}
        className={`accordion-header ${isOpen ? "pb-2" : ""}`}
        onClick={toggleAccordion}
      >
        {title}
        <span
          className={`h-8 w-8 rounded-lg ${isOpen ? "bg-tertiary/60" : "bg-body"} flex items-center justify-center`}
        >
          <svg
            className={`accordion-icon transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line
              x1="12"
              y1="5"
              x2="12"
              y2="19"
              className={`transition-opacity duration-500 ${isOpen ? "opacity-0" : "opacity-100"}`}
            ></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ height, overflow: "hidden", transition: "height 0.5s ease" }}
      >
        {isOpen && <div className="accordion-content [&_*]:m-0">{children}</div>}
      </div>
    </div>
  );
};

export default Accordion;
