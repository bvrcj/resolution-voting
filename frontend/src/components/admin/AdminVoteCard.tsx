import VoteCardBase from "@/components/common/VoteCardBase";

type VoteForm = {
  resolutionId: string;
  proxyForUserId: string;
  proxyForName: string;
  choice: string;
  latitude: string;
  longitude: string;
};

type ResolutionOption = {
  id: number;
  title: string;
  room?: {
    name: string;
  };
  status?: string;
};

type UserOption = {
  id: number;
  name: string;
  role?: string;
};

type AdminVoteCardProps = {
  voteForm: VoteForm;
  onChange: (form: VoteForm) => void;
  onSubmit: () => void;
  resolutions: ResolutionOption[];
  users: UserOption[];
  isProxyVoting: boolean;
  currentUserId: number | null;
};

export default function AdminVoteCard({
  voteForm,
  onChange,
  onSubmit,
  resolutions,
  users,
  isProxyVoting,
  currentUserId
}: AdminVoteCardProps) {
  return (
    <VoteCardBase
      voteForm={voteForm}
      onChange={onChange}
      onSubmit={onSubmit}
      resolutions={resolutions}
      users={users}
      isProxyVoting={isProxyVoting}
      currentUserId={currentUserId}
      submitLabel="Cast Vote"
      title="Admin Voting"
      containerClassName="rounded-3xl border border-white/30 bg-white/80 p-6 shadow-lg backdrop-blur"
      contentClassName="mt-4 space-y-3 text-sm"
    />
  );
}
