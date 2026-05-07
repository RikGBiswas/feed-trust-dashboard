import { useEffect, useRef, useState } from "react";

const inputCls =
  "w-full h-9 px-3 rounded-md border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring";

/**
 * A combobox that shows a dropdown of suggestions but also allows free-text entry.
 * Users can select from existing values or type a new one.
 */
export function ComboBox({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter(
    (o) => o.toLowerCase().includes((filter || value).toLowerCase())
  );

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      <input
        ref={inputRef}
        className={inputCls}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setFilter(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setFilter("");
          setOpen(true);
        }}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-card shadow-lg text-sm">
          {filtered.map((o) => (
            <li
              key={o}
              className={`px-3 py-1.5 cursor-pointer hover:bg-accent ${
                o === value ? "bg-accent/60 font-medium" : ""
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(o);
                setOpen(false);
                setFilter("");
              }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
