type ResolutionForm = {
  title: string;
  description: string;
  roomId: string;
  publishAt: string;
  votingStartAt: string;
  votingEndAt: string;
};

type ResolutionFormCardProps = {
  resolutionForm: ResolutionForm;
  onChange: (form: ResolutionForm) => void;
  onSubmit: () => void;
};

export default function ResolutionFormCard({
  resolutionForm,
  onChange,
  onSubmit
}: ResolutionFormCardProps) {
  return (
    <div className="rounded-3xl border border-white/30 bg-white/80 p-6 shadow-lg backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-900 font-display">Create Resolution</h2>
      <div className="mt-4 space-y-3 text-sm">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Title
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Title"
            value={resolutionForm.title}
            onChange={(event) => onChange({ ...resolutionForm, title: event.target.value })}
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Description
          <textarea
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Description"
            rows={3}
            value={resolutionForm.description}
            onChange={(event) => onChange({ ...resolutionForm, description: event.target.value })}
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Room Id
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Room id"
            value={resolutionForm.roomId}
            onChange={(event) => onChange({ ...resolutionForm, roomId: event.target.value })}
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Publish Date/Time
          <input
            type="datetime-local"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Publish date/time"
            value={resolutionForm.publishAt}
            onChange={(event) => onChange({ ...resolutionForm, publishAt: event.target.value })}
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Voting Start Date/Time
          <input
            type="datetime-local"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Voting start date/time"
            value={resolutionForm.votingStartAt}
            onChange={(event) => onChange({ ...resolutionForm, votingStartAt: event.target.value })}
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Voting End Date/Time
          <input
            type="datetime-local"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="Voting end date/time"
            value={resolutionForm.votingEndAt}
            onChange={(event) => onChange({ ...resolutionForm, votingEndAt: event.target.value })}
          />
        </label>
        <button
          onClick={onSubmit}
          className="w-full rounded-xl bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800"
        >
          Create Resolution
        </button>
      </div>
    </div>
  );
}
