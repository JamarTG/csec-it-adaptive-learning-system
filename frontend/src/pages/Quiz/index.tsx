import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import PageContent from "../../components/layout/Page";
import useAuthRedirect from "../../hook/useAuthRedirect";
import SectionHeader from "../../components/SectionHeader";

import { QuizAPI } from "../../utils/api";
import { SuccessfulQuizResponse } from "../../types/auth";
import { extractErrorMessage } from "../../utils/error";
import { Topic } from "./QuizCard";
import QuizSidebar from "./QuizSidebar";
import TopicGrid from "./TopicGrid";
import { mdiCursorDefaultClick } from "@mdi/js";
import Loader from "../../components/common/Loader";

const QuizSelectionPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const navigate = useNavigate();

  useAuthRedirect();

  const { 
    data: activeSession,
    isLoading: isSessionLoading
  } = useQuery({
    queryKey: ["active-quiz-session"],
    queryFn: QuizAPI.checkActiveSession,
    retry: false, 
  });

  useEffect(() => {
    
    if (activeSession?.data?.hasActiveSession && activeSession.data.sessionId) {
      navigate(`/quiz/${activeSession.data.sessionId}`);
    }
  }, [activeSession, navigate]);

  const onCreateQuizSuccess = ({ message, session }: SuccessfulQuizResponse) => {
    toast.success(message);
    setSelectedTopic(null);
    navigate(`/quiz/${session._id}`, { state: { session } });
  };

  const onError = (error: AxiosError) => {
    toast.error(extractErrorMessage(error));
    setSelectedTopic(null);
  };

  const { mutate: createQuizMutate } = useMutation({
    mutationFn: QuizAPI.createQuiz,
    mutationKey: ["create-quiz"],
    onSuccess: onCreateQuizSuccess,
    onError,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-topics"],
    queryFn: QuizAPI.getTopics,
  });

  const topicList: Topic[] = data?.topics || [];

  if (isSessionLoading) {
    return <Loader text="Checking your quiz progress..." />;
  }

  return (
    <PageContent title="Quiz">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full flex flex-col gap-5">
          <SectionHeader
            iconPath={mdiCursorDefaultClick}
            title="Select a Topic"
          />
          <TopicGrid
            isLoading={isLoading}
            isError={isError}
            topics={topicList}
            onSelectTopic={setSelectedTopic}
          />
        </div>
        <QuizSidebar
          selectedTopic={selectedTopic}
          onStart={() => {
            if (selectedTopic) createQuizMutate({ topic: selectedTopic._id });
          }}
          topicsLoading={isLoading}
        />
      </div>
    </PageContent>
  );
};

export default QuizSelectionPage;