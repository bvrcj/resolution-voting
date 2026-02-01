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

type VoteCardBaseProps = {
  voteForm: VoteForm;
  onChange: (form: VoteForm) => void;
  onSubmit: () => void;
  resolutions: ResolutionOption[];
  users: UserOption[];
  isProxyVoting: boolean;
  currentUserId: number | null;
  currentUserRole?: string | null;
  submitLabel: string;
  title?: string;
  containerClassName?: string;
  contentClassName?: string;
};

export default function VoteCardBase({
  voteForm,
  onChange,
  onSubmit,
  resolutions,
  users,
  isProxyVoting,
  currentUserId,
  currentUserRole,
  submitLabel,
  title,
  containerClassName = "grid gap-3 text-sm",
  contentClassName = "grid gap-3 text-sm"
}: VoteCardBaseProps) {
  const selectedResolution = resolutions.find(
    (resolution) => resolution.id === Number(voteForm.resolutionId)
  );
  const selectedProxyUser = users.find((user) => user.id === Number(voteForm.proxyForUserId));

  const isSelfProxy =
    isProxyVoting &&
    Boolean(currentUserId) &&
    Number(voteForm.proxyForUserId) === Number(currentUserId);
  const isAdminProxyTarget = currentUserRole === "USER" && selectedProxyUser?.role === "ADMIN";

  return (
    <div className={containerClassName}>
      {title && <h2 className="text-lg font-semibold text-slate-900 font-display">{title}</h2>}
      <div className={contentClassName}>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          value={voteForm.resolutionId}
          onChange={(event) => onChange({ ...voteForm, resolutionId: event.target.value })}
        >
          <option value="">Select resolution</option>
          {resolutions.map((resolution) => (
            <option key={resolution.id} value={resolution.id}>
              {resolution.title} {resolution.room?.name ? `- ${resolution.room.name}` : ""}
            </option>
          ))}
        </select>
        {selectedResolution ? (
          <div className="rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
            <div className="font-semibold">{selectedResolution.title}</div>
            <div>Room: {selectedResolution.room?.name ?? "Unassigned"}</div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Select a resolution to show details.</p>
        )}
        {isProxyVoting ? (
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            value={voteForm.proxyForUserId}
            onChange={(event) => {
              const selected = users.find((user) => user.id === Number(event.target.value));
              onChange({
                ...voteForm,
                proxyForUserId: event.target.value,
                proxyForName: selected?.name ?? ""
              });
            }}
          >
            <option value="">Select proxy voter</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-slate-500">Proxy selection is available only during proxy voting.</p>
        )}
        {isSelfProxy && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            You cannot cast a proxy vote for yourself. Select a different user.
          </p>
        )}
        {isAdminProxyTarget && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            Proxy voting for admins is not allowed. Select a different user.
          </p>
        )}
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          value={voteForm.choice}
          onChange={(event) => onChange({ ...voteForm, choice: event.target.value })}
        >
          <option value="FOR">FOR</option>
          <option value="AGAINST">AGAINST</option>
          <option value="ABSTAIN">ABSTAIN</option>
        </select>
        <button
          onClick={onSubmit}
          disabled={isSelfProxy || isAdminProxyTarget}
          className="rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
