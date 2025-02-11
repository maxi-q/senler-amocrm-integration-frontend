interface IOption {
  label: string;
  value: string;
}

interface ISelectField {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  options: IOption[];
}

export const SelectField = ({ label, value, setValue, options }: ISelectField) => {
  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
      <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#fff',
          fontSize: '14px',
        }}
      >
        {/* {options?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))} */}
      </select>
    </div>
  );
};
