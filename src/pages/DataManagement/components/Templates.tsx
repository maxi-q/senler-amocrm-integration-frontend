import { getSenlerGroupTemplates, integrationStepTemplate, createIntegrationStepTemplates } from "@/api/Backend/templates"
import { getUrlParams } from "@/helpers"
import { useEffect, useState } from "react"
import { MySelectDropdown } from "./ui/SelectFields"

interface ITemplates {
  data?: any,
  setData:  (mockMessage?: { private: any; public: any; }) => void
}

export const Templates = ({data, setData}: ITemplates) => {
  const [ templates, setTemplates ] = useState<integrationStepTemplate[]>([])
  const [ senlerGroupIdW, setSenlerGroupIdW ] = useState<string>()
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
  }, [])

  const saveTemplate = async () => {
    if (!senlerGroupIdW) return
    const newTemplate = await createIntegrationStepTemplates({settings: data, senlerGroupId: senlerGroupIdW, name: 'шаблон '+(new Date()).getSeconds()})
    if (newTemplate.ok) setTemplates(p => [...p, newTemplate.data!])
  }

  return (
    <div className="text-left">
      <h3>Шаблон настроек</h3>
      <div className="flex items-center gap-3 my-3">
        <MySelectDropdown onValueChange={onChangeTemplate} options={templates.map(el => ({ value: el.id, label: el.name }))} isOpen={isOpen} setIsOpen={setIsOpen} />
        <button onClick={saveTemplate} className="px-4 py-2 bg-[#428BCA] text-white rounded-md hover:bg-[#025aa5] transition-colors duration-200">+</button>
      </div>
      <p className="ms-2 text-xs">Сохраняя настройки с выбранным шаблоном,<br/>вы изменяете шаблон, применяя настройку только на этот шаг</p>
    </div>
  )
}