import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

const isDarkModeA = atomWithStorage<boolean>("idle-rockets-isDarkMode", true);

const ThemeCtrl = () => {
    const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeA);

    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [isDarkMode]);

    return (
        <label className="swap swap-rotate">
            <input
                type="checkbox"
                className="theme-controller"
                checked={isDarkMode}
                onChange={(evt) => setIsDarkMode(evt.target.checked)}
                value="black"
            />

            <Sun className="swap-off h-10 w-10 fill-current text-primary-content" />

            <Moon className="swap-on h-10 w-10 fill-current" />
        </label>
    );
};

export default ThemeCtrl;
