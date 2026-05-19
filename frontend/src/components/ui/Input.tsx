interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition
          focus:ring-2 focus:ring-blue-500
          ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
