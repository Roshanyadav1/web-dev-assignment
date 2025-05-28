import clsx from "clsx";

export default function Input({
  type = "text",
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={clsx(
        "px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
        className
      )}
      {...props}
    />
  );
}
