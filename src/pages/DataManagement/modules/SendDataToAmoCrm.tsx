import { useState } from 'react'
import EditableTable from '../components/KeyValueInput'
import { TextField } from '../components/TextField'

interface SendDataToAmoCrm {
  data: Array<{
    from: string;
    to: string;
  }>,
  setData: React.Dispatch<React.SetStateAction<{
    from: string;
    to: string;
}[]>>
}

export const SendDataToAmoCrm = (props: SendDataToAmoCrm) => {

	const [privateText, setPrivateText] = useState('')

	return (
		<div>
      <TextField label={'Some lable'} value={privateText} setValue={setPrivateText} />

      <EditableTable data={props.data} changeData={props.setData} />


		</div>
	)
}

