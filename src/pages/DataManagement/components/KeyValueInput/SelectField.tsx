import { IDataRow } from '.';

interface MySelectProps {
  value: string;
  label: string;
  rowIndex: number;
  onValueChange: (rowIndex: number, key: keyof IDataRow, newValue: string) => void;
  sourceKey: keyof IDataRow;
  options?: {
    value: string;
    label: string;
  }[];
}

const MySelect = ({ value, label, rowIndex, onValueChange, options, sourceKey }: MySelectProps) => {
  const isLoad = Boolean(options);
  console.log('options', options)
  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">{label}</label>
      <select
        onChange={(e) => onValueChange(rowIndex, sourceKey, e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        value={value}
        disabled={!isLoad}
      >
        {!isLoad ? (
          <option value="">Загрузка...</option>
        ) : (
          <>
            <option value="">Выберите значение</option>
            {options?.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
};

export default MySelect;
