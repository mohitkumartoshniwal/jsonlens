import {
  Children,
  ReactElement,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

type DropdownProps = {
  label: string;
  children: ReactElement[];
};

const Dropdown = ({ label, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const clonedChildren = Children.map(children, (child) => {
    return cloneElement(child, { onClick: handleClose });
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="py-2 px-4 rounded flex items-center"
      >
        {label} <MdKeyboardArrowDown />
      </button>
      {isOpen && (
        <div className="absolute left-5 top-8 py-2 flex flex-col items-center gap-1 rounded-md shadow-2xl border px-2 z-20  bg-white dark:bg-dark_shade_1 dark:border-gray-700">
          {clonedChildren}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
