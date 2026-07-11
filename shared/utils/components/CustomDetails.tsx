"use client";
import {
  type DetailsHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export const CustomDetails = forwardRef<
  HTMLDetailsElement,
  DetailsHTMLAttributes<HTMLDetailsElement>
>(({ children, ...props }, ref) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  // Exposes the dialogRef.current to the parent component when using forwardRef.
  useImperativeHandle(ref, () => detailsRef.current!, []);
  useEffect(() => {
    function closeDetails({ target }: PointerEvent) {
      if (!detailsRef.current?.contains(target as Node))
        detailsRef.current?.removeAttribute("open");
    }
    window.addEventListener("click", closeDetails);
    return () => window.removeEventListener("click", closeDetails);
  }, []);
  return (
    <details {...props} ref={detailsRef}>
      {children}
    </details>
  );
});

CustomDetails.displayName = "CustomDetails";
