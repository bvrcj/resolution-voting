type RoomForm = {
  name: string;
  latitude: string;
  longitude: string;
};

type RoomFormCardProps = {
  roomForm: RoomForm;
  onChange: (form: RoomForm) => void;
  onSubmit: () => void;
};

export default function RoomFormCard({ roomForm, onChange, onSubmit }: RoomFormCardProps) {
  return (
    <div className="rounded-3xl border border-white/30 bg-white/80 p-6 shadow-lg backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-900 font-display">Create Room</h2>
      <div className="mt-4 space-y-3 text-sm">
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          placeholder="Room name"
          value={roomForm.name}
          onChange={(event) => onChange({ ...roomForm, name: event.target.value })}
        />
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          placeholder="Latitude"
          value={roomForm.latitude}
          onChange={(event) => onChange({ ...roomForm, latitude: event.target.value })}
        />
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          placeholder="Longitude"
          value={roomForm.longitude}
          onChange={(event) => onChange({ ...roomForm, longitude: event.target.value })}
        />
        <button
          onClick={onSubmit}
          className="w-full rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700"
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
