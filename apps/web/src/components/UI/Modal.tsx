import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};
const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ">
      <div className="relative w-72 h-auto landscape:max-md:h-full landscape:max-md:w-2/3 md:h-auto  md:w-96 bg-white dark:bg-dark_shade_1 dark:border-gray-300 text-lightText dark:text-darkText p-6 shadow-lg rounded-md  ">
        {children}
        <button className="absolute top-0 right-0 p-3" onClick={onClose}>
          &#x2715;
        </button>
      </div>
    </div>
  );
};

export default Modal;
