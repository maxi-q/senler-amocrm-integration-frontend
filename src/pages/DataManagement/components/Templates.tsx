import { getSenlerGroupTemplates, integrationStepTemplate, createIntegrationStepTemplates } from "@/api/Backend/templates"
import { getUrlParams } from "@/helpers"
import { useEffect, useState } from "react"
import { MySelectDropdown } from "./ui/SelectFields"

interface ITemplates {
  data?: any,
  setData:  (mockMessage?: { private: any; public: any; }) => void
}

export const Templates = ({data, setData}: ITemplates) => {
  const [templates, setTemplates] = useState<integrationStepTemplate[]>([])
  const { senlerGroupId } = getUrlParams()

  const onChangeTemplate = (template_id: string) => {
    const template = templates.find( el => el.id == template_id)
    setData(template?.settings)
  }

  useEffect(()=>{
    (async () => {
      const result = await getSenlerGroupTemplates({senlerGroupId})
      if(result.ok){
        setTemplates(result.templates || [])
      }
    })()
  }, [])

  const saveTemplate = async () => {
    const newTemplate = await createIntegrationStepTemplates({settings: data, senlerGroupId, name: 'шаблон '+(new Date()).getSeconds()})
    if (newTemplate.ok) setTemplates(p => [...p, newTemplate.data!])
  }

  return (
    <>
      <button onClick={saveTemplate}>save template</button>
      <MySelectDropdown onValueChange={onChangeTemplate} options={templates.map(el => ({value: el.id, label: el.name}))} />
    </>
  )
}