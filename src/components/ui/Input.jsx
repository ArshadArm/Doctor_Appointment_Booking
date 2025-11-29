export default function Input({ label, ...props }) {
  return (
    <label className="block text-sm">
      {label && <div className="mb-1 text-slate-600">{label}</div>}
      <input
        className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        {...props}
      />
    </label>
  );
}