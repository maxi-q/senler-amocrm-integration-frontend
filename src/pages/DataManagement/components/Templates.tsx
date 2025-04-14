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
  const [senlerGroupIdW, setSenlerGroupIdW] = useState<string>()
  const { senlerGroupId } = getUrlParams()
  const [isOpen, setIsOpen] = useState(false);

  const onChangeTemplate = (template_id: string) => {
    const template = templates.find( el => el.id == template_id)
    setData(template?.settings)
  }

  useEffect(()=>{
    (async () => {
      const result = await getSenlerGroupTemplates({senlerGroupId})
      console.log('result', result)
      if(result.ok){
        setTemplates(result.templates || [])
        setSenlerGroupIdW(result.senlerGroupId)
      }
    })()
    console.log('go')

  }, [])

  const saveTemplate = async () => {
    if (!senlerGroupIdW) return
    const newTemplate = await createIntegrationStepTemplates({settings: data, senlerGroupId: senlerGroupIdW, name: 'шаблон '+(new Date()).getSeconds()})
    if (newTemplate.ok) setTemplates(p => [...p, newTemplate.data!])
  }

  return (
    <>
      <button onClick={saveTemplate} className="px-4 py-2 mt-2 bg-[#428BCA] text-white rounded-md hover:bg-[#025aa5] transition-colors duration-200">save template</button>
      <MySelectDropdown onValueChange={onChangeTemplate} options={templates.map(el => ({ value: el.id, label: el.name }))} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}