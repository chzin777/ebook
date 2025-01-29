export interface FieldProps {
    control: any;
    name: string;
    label: string;
    placeholder: string;
    type?: string;
    options?: { value: string; label: string }[];
  }