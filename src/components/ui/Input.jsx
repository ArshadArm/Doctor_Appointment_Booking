// src/components/ui/Input.jsx
export default function Input({ label, id, name, error, ...props }) {
  return (
    <label className="block text-sm">
      {label && <div className="mb-1 text-slate-600">{label}</div>}
      <input
        id={id || name}
        name={name}
        className={`w-full px-3 py-2 rounded border ${
          error ? "border-red-400" : "border-slate-300"
        } focus:outline-none focus:ring-2 focus:ring-indigo-300`}
        {...props}
      />
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </label>
  );
}