import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-md font-medium transition",
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
          "bg-gray-200 text-black hover:bg-gray-300": variant === "secondary",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
