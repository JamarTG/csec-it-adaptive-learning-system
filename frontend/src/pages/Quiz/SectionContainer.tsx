import { UseMutateFunction } from "@tanstack/react-query";
import { Section_Map } from "../../constants";
import { CreateQuizPayload, SuccessfulQuizResponse } from "../../types/auth";
import { AxiosError } from "axios";
import QuizSection from "./QuizSection";

interface QuizSectionContainerProps {
  createQuizMutate: UseMutateFunction<SuccessfulQuizResponse, AxiosError<unknown, any>, CreateQuizPayload, unknown>;
  loadingSection: string | null;
  setLoadingSection: React.Dispatch<React.SetStateAction<string | null>>;
}

const QuizSectionContainer = ({
  createQuizMutate,
  loadingSection,
  setLoadingSection,
}: QuizSectionContainerProps) => {

  const handleClick = (section: string) => {
    setLoadingSection(section);
    createQuizMutate({ section: Number(section) });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Object.entries(Section_Map).map(([section, data]) => (
        <div key={section} className="h-[180px] w-full">
          <QuizSection
            section={{ name: data.name, bgSrc: data.bgSrc }}
            onClick={() => handleClick(section)}
            isLoading={loadingSection === section}
          />
        </div>
      ))}
    </div>
  );
};

export default QuizSectionContainer;
