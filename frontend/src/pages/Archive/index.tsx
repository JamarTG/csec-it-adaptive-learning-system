import PageLayout from "../../components/layout/Page";
import QuizHistoryList from "./QuizHistoryList";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import SectionHeader from "../../components/SectionHeader";
import { IconifyIcons } from "../../icons";

const QuizHistory = () => {
  useAuthRedirect();

  return (
    <PageLayout title="History">
      <div className="flex flex-col justify-center gap-3">
        <SectionHeader
          iconPath={IconifyIcons.history}
          title={"History List"}
        />
        <QuizHistoryList />
      </div>
    </PageLayout>
  );
};

export default QuizHistory;
