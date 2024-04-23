import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";
import { THEMES, useCustomTheme } from "@jsonlens/json-parts";

const VSHeader = () => {
  const { isDarkMode, setTheme } = useCustomTheme();
  return (
    <>
      <nav className="h-[1rem] w-full flex justify-between items-center py-2 border-b-2  text-lightText dark:text-darkText ">
        <div className="flex justify-between">
          <div>
            <button
              onClick={() => setTheme(isDarkMode ? THEMES.LIGHT : THEMES.DARK)}
            >
              {isDarkMode ? <MdOutlineLightMode /> : <MdOutlineNightlight />}
            </button>
          </div>
        </div>
      </nav>
      ;
    </>
  );
};

export default VSHeader;
