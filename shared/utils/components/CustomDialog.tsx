import {
  type DialogHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

type DialogProps = {
  isOpen: boolean;
  onClose?: () => void;
  // Add any other custom props you need for your dialog
} & DialogHTMLAttributes<HTMLDialogElement>;

const CustomDialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ children, isOpen, onClose, ...props }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    // Exposes the dialogRef.current to the parent component when using forwardRef.
    useImperativeHandle(ref, () => dialogRef.current!, []);

    useEffect(() => {
      if (dialogRef.current) {
        const dialogElement = dialogRef.current;
        if (isOpen) dialogElement.showModal();
        else dialogElement.close();

        const handleClose = () => {
          onClose?.();
        };

        dialogElement.addEventListener("close", handleClose);

        return () => {
          dialogElement.removeEventListener("close", handleClose);
        };
      }
    }, [isOpen, onClose]);

    return (
      <dialog ref={dialogRef} {...props}>
        {children}
      </dialog>
    );
  }
);

CustomDialog.displayName = "CustomDialog";

export default CustomDialog;
