import { FadeLoader } from "react-spinners";
import { useTheme } from "@/hooks";
import type { FC } from "react";

interface LoaderProps {
  text: string;
}

const Loader: FC<LoaderProps> = ({ text }) => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center justify-center h-screen bg-transparent">
      <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
        <FadeLoader color={isDark ? "#ffffff" : "#333333"} />
        <h3
          className={`text-xl font-medium ${isDark ? "text-white" : "text-gray-700"}`}
        >
          {text}
        </h3>
      </div>
    </div>
  );
};

export default Loader;
