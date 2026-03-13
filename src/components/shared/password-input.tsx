"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type PasswordInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  invalid?: boolean;
};

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Masukkan password",
  autoComplete = "current-password",
  disabled = false,
  invalid = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup data-disabled={disabled || undefined}>
      <InputGroupInput
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => {
          const target = event?.currentTarget ?? (event?.target as HTMLInputElement | null);
          onChange(target?.value ?? "");
        }}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={invalid}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setVisible((state) => !state)}
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          disabled={disabled}
        >
          {visible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
