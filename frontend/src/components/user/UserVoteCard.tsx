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

type UserVoteCardProps = {
  voteForm: VoteForm;
  onChange: (form: VoteForm) => void;
  onSubmit: () => void;
  resolutions: ResolutionOption[];
  users: UserOption[];
  isProxyVoting: boolean;
  currentUserId: number | null;
  currentUserRole?: string | null;
};

export default function UserVoteCard({
  voteForm,
  onChange,
  onSubmit,
  resolutions,
  users,
  isProxyVoting,
  currentUserId,
  currentUserRole
}: UserVoteCardProps) {
  return (
    <VoteCardBase
      voteForm={voteForm}
      onChange={onChange}
      onSubmit={onSubmit}
      resolutions={resolutions}
      users={users}
      isProxyVoting={isProxyVoting}
      currentUserId={currentUserId}
      currentUserRole={currentUserRole}
      submitLabel="Submit Vote"
    />
  );
}
