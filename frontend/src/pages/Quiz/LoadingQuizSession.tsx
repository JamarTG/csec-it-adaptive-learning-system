import { Icon } from "@mdi/react";
import { mdiLoading } from "@mdi/js";

const LoadingQuizSession = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="p-6 bg-gray-100 rounded-full">
        <Icon path={mdiLoading} size={2} className="text-gray-400 animate-spin" />
      </div>
      <h3 className="text-xl font-medium text-gray-700">Loading quiz session...</h3>
    </div>
  </div>
);

export default LoadingQuizSession;
