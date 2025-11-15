export function Button({ children, ...props }) {
  return (
    <button
      className="bg-greenLikeLemmon text-white px-4 py-2 rounded hover:bg-green-600 transition"
      {...props}
    >
      {children}
    </button>
  );
}
