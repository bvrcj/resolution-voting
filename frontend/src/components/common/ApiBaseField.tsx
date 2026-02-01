type ApiBaseFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ApiBaseField({ value, onChange }: ApiBaseFieldProps) {
  return (
    <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center">
      <label className="text-xs uppercase tracking-[0.2em] text-slate-500">API Base URL</label>
      <input
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
