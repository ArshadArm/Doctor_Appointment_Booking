export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded shadow-sm inline-flex items-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
}