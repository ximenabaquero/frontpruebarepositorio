"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberWithError } from "libphonenumber-js";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onDirty?: () => void;
  label?: string;
  variant?: "default" | "modal";
};

const COUNTRIES = [
  "co",
  "ve",
  "ec",
  "pe",
  "bo",
  "cl",
  "ar",
  "uy",
  "py",
  "br",
  "mx",
  "gt",
  "hn",
  "sv",
  "ni",
  "cr",
  "pa",
  "cu",
  "do",
  "pr",
  "us",
  "ca",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "gb",
  "nl",
  "be",
  "ch",
];

const PREFERRED = ["co", "ve", "ec", "pe", "mx", "ar", "es"];

export default function PhoneInputField({
  value,
  onChange,
  onDirty,
  label = "Celular",
  variant = "default",
}: Props) {
  const isModal = variant === "modal";

  return (
    <div style={{ position: "relative", zIndex: 99999 }}>
      {isModal ? (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      ) : (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <PhoneInput
        country="co"
        onlyCountries={COUNTRIES}
        preferredCountries={PREFERRED}
        value={value}
        onChange={(fullNumber) => {
          try {
            const phone = parsePhoneNumberWithError("+" + fullNumber);
            onChange(phone.formatInternational());
          } catch {
            onChange("+" + fullNumber);
          }
          onDirty?.();
        }}
        inputStyle={{
          width: "100%",
          height: isModal ? "36px" : "38px",
          borderRadius: isModal ? "0.75rem" : "0.75rem",
          border: "1px solid #e5e7eb",
          fontSize: "0.875rem",
          paddingLeft: "48px",
          color: "#111827",
          boxShadow: isModal ? "none" : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
        buttonStyle={{
          borderRadius: "0.75rem 0 0 0.75rem",
          border: "1px solid #e5e7eb",
          borderRight: "none",
          backgroundColor: "#fff",
          paddingLeft: "8px",
        }}
        dropdownStyle={{
          borderRadius: "0.75rem",
          fontSize: "0.875rem",
          zIndex: 99999,
          position: "fixed",
          width: "280px",
          maxHeight: "180px",
          overflowY: "auto",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          border: "1px solid #e5e7eb",
        }}
        searchStyle={{
          width: "calc(100% - 16px)",
          margin: "2px",
          padding: "5px 10px",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          fontSize: "0.8125rem",
          color: "#111827",
          backgroundColor: "#f9fafb",
          outline: "none",
        }}
        placeholder="Número de celular"
        enableSearch
        disableSearchIcon
        searchPlaceholder="Buscar país..."
        searchNotFound="País no encontrado"
      />
    </div>
  );
}
