import { ConversationDetail } from "@/features/history/conversation-detail";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="h-[calc(100vh-64px)]">
      <ConversationDetail conversationId={id} />
    </div>
  );
}
