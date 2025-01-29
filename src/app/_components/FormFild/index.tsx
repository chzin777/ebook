import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FieldProps } from '../../../../types/types';

export const InputField = ({ control, name, label, placeholder, type = 'text' }: FieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input placeholder={placeholder} {...field} type={type} />
        </FormControl>
      </FormItem>
    )}
  />
);