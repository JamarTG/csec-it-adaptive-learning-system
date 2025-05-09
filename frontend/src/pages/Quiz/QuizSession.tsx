import { useEffect, useState } from "react";

import QuizQuestion from "./QuizQuestion";
import QuizHeader from "./QuizHeader";
import PageLayout from "../../components/layout/Page";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QuizAPI } from "../../utils/api";
import { Question, QuizSessionResponse } from "../../types/quiz";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { extractErrorMessage } from "../../utils/error";
import Loader from "../../components/common/Loader";
import QuizLoadError from "./QuizLoadError";

const QuizSession = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const { id } = useParams();
  const location = useLocation();
  const sessionFromState = location.state?.session;
  const navigate = useNavigate();

  const {
    data: session,
    isLoading,
    error,
    refetch,
  } = useQuery<QuizSessionResponse>({
    queryKey: ["quizSession", id],
    queryFn: () => QuizAPI.getQuizById(id!),
    initialData: sessionFromState,
    enabled: !!id,
    refetchOnMount: true,
  });

  const { mutate: autoSubmitMutation, isPending } = useMutation({
    mutationFn: QuizAPI.autoSubmit,
    onSuccess: (data) => {
      navigate(`/review/${data._id || session.session._id}`);
    },
  });

  const { mutate: submitAnswerMutation } = useMutation({
    mutationFn: QuizAPI.submitAnswer,
    onError: (error: AxiosError) => toast.error(extractErrorMessage(error)),
  });

  useEffect(() => {
    if (!session?.session?.createdAt) {
      refetch();
    }
  }, [session, refetch]);

  useEffect(() => {
    if (session?.session?.currentQuestionIndex !== undefined) {
      setCurrentIndex(session.session.currentQuestionIndex);
    }
  }, [session]);

  if (isLoading || !session?.session) return <Loader text="Loading Quiz Session" />;
  if (error) return <QuizLoadError />;

  const questions = session.session.questions.map((q: Question) => {
    return {
      id: q._id,
      question: q.question,
      options: {
        A: q.option_a,
        B: q.option_b,
        C: q.option_c,
        D: q.option_d,
      },
      correctAnswer: q.correct_answer,
      selectedOption: q.selectedOption,
      isCorrect: q.isCorrect,
      explanation:q.explanation,
      answeredAt: q.answeredAt,
    };
  });

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswerSelect = (index: number) => setSelectedAnswer(index);

  const handleSubmitQuiz = () => {
    autoSubmitMutation(session.session._id);
  };

  const handleNextQuestion = () => {
    const selectedKey = selectedAnswer !== null ? Object.keys(currentQuestion.options)[selectedAnswer] : "";

    const isCorrect = selectedKey === currentQuestion.correctAnswer;

    submitAnswerMutation({
      quiz: session.session._id,
      question: currentQuestion.id,
      selectedOption: selectedKey,
      score: isCorrect ? score + 1 : score,
      is_correct: isCorrect,
    });

    if (isCorrect) setScore((prev) => prev + 1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      autoSubmitMutation(session.session._id);
 
    }
  };

  if (session?.session.completed) {
    navigate(`/review/${session.session._id}`, { replace: true });
    return null;
  }

  return (
    <PageLayout title="Quiz">
      <div className="relative w-full h-full">
        <div className="flex items-start justify-center h-[calc(100vh-4rem)] w-full overflow-hidden px-2">
          <div className="w-full max-w-4xl flex flex-col gap-6">
            <QuizHeader
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              onSubmitQuiz={handleSubmitQuiz}
              isSubmitting={isPending}
            />

            {currentQuestion && (
              <QuizQuestion
                question={`${currentIndex + 1}. ${currentQuestion.question}`}
                answers={Object.values(currentQuestion.options)}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
                onNextQuestion={handleNextQuestion}
                isLastQuestion={isLastQuestion}
              />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default QuizSession;
