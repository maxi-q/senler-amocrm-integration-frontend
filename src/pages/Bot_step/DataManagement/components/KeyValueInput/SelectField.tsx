import { IDataRow } from '.';
import { MessageEditor } from '../VariablesModal';
import { SelectField } from '../SelectField';

interface MySelectProps {
  value: string;
  label?: string;
  rowIndex: number;
  onValueChange: (rowIndex: number, key: keyof IDataRow, newValue: string) => void;
  sourceKey: keyof IDataRow;
  options?: {
    value: string;
    label: string;
  }[];
  type?: 'senler' | 'no-senler'
}

const MySelect = ({ value, rowIndex, onValueChange, options, sourceKey, type}: MySelectProps) => {
  options = options?.map(el => ({...el, value: `%${el.value}%`}));
  console.log(options)
  return (
    <div>
      <MessageEditor type={type} options={options} initialContent={value} onContentChange={(content) => onValueChange(rowIndex, sourceKey, content)} />
    </div>
  );
};

export const MySelectOldV = ({ value, rowIndex, onValueChange, options, sourceKey }: MySelectProps) => {
  const isLoad = Boolean(options);

  return (
    <SelectField
      value={value}
      setValue={(value) => onValueChange(rowIndex, sourceKey, value)}
      options={options || []}
      disabled={!isLoad}
    />
  );
};

export default MySelect;
