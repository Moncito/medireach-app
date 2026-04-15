import { ConversationList } from "@/features/history/conversation-list";
import { Clock } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-coral/10 flex items-center justify-center">
          <Clock className="w-5 h-5 text-accent-coral" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">
            History
          </h1>
          <p className="text-sm text-muted">
            Review your past symptom checks
          </p>
        </div>
      </div>

      <ConversationList />
    </div>
  );
}
