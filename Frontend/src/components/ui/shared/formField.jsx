// components/ui/shared/FormField.jsx
import { Label } from "@/components/ui/doctor/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  error,
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {type === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : type === "select" ? (
        <Select id={name} name={name} value={value} onChange={onChange}>
          <option value="">Select {label}</option>
          {options?.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
