interface ITextField {
  label: string
  value: string
  setValue: (value: React.SetStateAction<string>) => void
}

export const TextField = ({label, value, setValue}: ITextField) => {
  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
				<label style={{ fontWeight: 'bold', marginTop: '8px', display: 'block' }}>{label}</label>
				<textarea
					value={value}
					onChange={(e) => setValue(e.target.value)}
					rows={4}
					style={{
						width: '100%',
						padding: '10px',
						border: '1px solid #ccc',
						borderRadius: '4px',
						resize: 'vertical'
					}}
				/>
			</div>
  )
}

export const InputField = ({label, value, setValue}: ITextField) => {
  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
				<label style={{ fontWeight: 'bold', marginTop: '8px', display: 'block' }}>{label}</label>
				<textarea
					value={value}
					onChange={(e) => setValue(e.target.value)}
					rows={4}
					style={{
            height: '46px',
						width: '100%',
						padding: '10px',
						border: '1px solid #ccc',
						borderRadius: '4px',
						resize: 'vertical'
					}}
				/>
			</div>
  )
}