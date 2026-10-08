import { ChevronDown } from 'lucide-react';

interface FieldProps {
  name: string;
  label: string;
  placeholder?: string;
  unit?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export function FormField({ name, label, placeholder, unit, options, min = 0, max, step = 1 }: FieldProps) {
  return <div className="form-field">
    <label htmlFor={name}>{label}</label>
    <div className="field-control">
      {options ? <><select id={name} name={name} defaultValue="" required><option value="" disabled>{placeholder}</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select><ChevronDown className="field-chevron" size={16} /></>
        : <><input id={name} name={name} type="number" min={min} max={max} step={step} placeholder={placeholder} required />{unit && <span className="field-unit">{unit}</span>}</>}
    </div>
  </div>;
}