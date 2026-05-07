"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  maxVisible?: number;
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder,
  emptyText = "Не нашли в списке — впишем свободным текстом",
  disabled,
  maxVisible = 8,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const q = value.trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => o.toLowerCase().includes(q))
    : options;
  const visible = filtered.slice(0, maxVisible);

  useEffect(() => {
    if (highlight >= visible.length) setHighlight(0);
  }, [visible.length, highlight]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        inputRef.current && !inputRef.current.contains(t) &&
        popRef.current && !popRef.current.contains(t)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(v: string) {
    onChange(v);
    setOpen(false);
    setHighlight(0);
    inputRef.current?.focus();
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && visible[highlight]) {
        e.preventDefault();
        pick(visible[highlight]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open}
          autoComplete="off"
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={onKey}
          className="w-full pl-4 pr-20 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={() => { onChange(""); inputRef.current?.focus(); setOpen(true); }}
            aria-label="Очистить"
            className="absolute right-10 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={() => { setOpen((o) => !o); inputRef.current?.focus(); }}
          aria-label={open ? "Свернуть" : "Развернуть"}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div
          ref={popRef}
          id={listId}
          role="listbox"
          className="absolute z-20 left-0 right-0 mt-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xl max-h-72 overflow-auto"
        >
          {visible.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[var(--muted)]">{emptyText}</div>
          ) : (
            <ul className="py-1">
              {visible.map((opt, i) => (
                <li key={opt}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === highlight}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => pick(opt)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      i === highlight
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
                    }`}
                  >
                    {opt}
                  </button>
                </li>
              ))}
              {filtered.length > visible.length && (
                <li className="px-4 py-2 text-xs text-[var(--muted)] border-t border-[var(--border)]">
                  ещё {filtered.length - visible.length}… продолжай печатать, чтобы сузить
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
