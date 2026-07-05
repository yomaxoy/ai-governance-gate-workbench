"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export function FieldLabel({
  label,
  required,
  hint,
}: {
  label: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-1.5">
      <label className="text-sm font-medium text-text">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary placeholder:text-muted";

export function TextField({
  label,
  required,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} hint={hint} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  required,
  hint,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} hint={hint} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${inputClass} resize-none`}
      />
    </div>
  );
}

export function SelectField({
  label,
  required,
  hint,
  value,
  onChange,
  options,
  placeholder = "Bitte wählen …",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} hint={hint} />
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} appearance-none pr-9 ${
            value ? "text-text" : "text-muted"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} className="text-text">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  );
}

export function MultiSelectField({
  label,
  required,
  hint,
  values,
  onChange,
  options,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  values: string[];
  onChange: (v: string[]) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const toggle = (o: string) =>
    onChange(values.includes(o) ? values.filter((v) => v !== o) : [...values, o]);

  return (
    <div>
      <FieldLabel label={label} required={required} hint={hint} />
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className={`${inputClass} flex items-center justify-between text-left`}
        >
          <span className={values.length ? "text-text" : "text-muted"}>
            {values.length ? `${values.length} ausgewählt` : "Bitte wählen …"}
          </span>
          <ChevronDown size={16} className="text-muted" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto scroll-thin rounded-md border border-border bg-white shadow-lg">
              {options.map((o) => {
                const active = values.includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => toggle(o)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface"
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        active ? "border-primary bg-primary text-white" : "border-border"
                      }`}
                    >
                      {active && <Check size={11} />}
                    </span>
                    {o}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="rounded-full bg-surface px-2.5 py-1 text-xs text-text"
            >
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
