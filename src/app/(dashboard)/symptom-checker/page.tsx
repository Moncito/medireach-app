import { ChatInterface } from "@/features/symptom-checker/chat-interface";

export default function SymptomCheckerPage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <ChatInterface />
    </div>
  );
}
