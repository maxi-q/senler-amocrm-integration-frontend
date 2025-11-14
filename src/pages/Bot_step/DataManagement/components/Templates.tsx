import { getSenlerGroupTemplates, integrationStepTemplate, createIntegrationStepTemplates, patchIntegrationStepTemplates } from "@/api/Backend/templates"
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

  const refreshTemplates = async () => {
    const result = await getSenlerGroupTemplates({ senlerGroupId })
      console.log('result', result)
      if(result.ok){
        setTemplates(result.templates || [])
        setSenlerGroupIdW(result.senlerGroupId)
      }
  }

  useEffect(()=>{
    refreshTemplates()
  }, [])

  const generateUniqueTemplateName = (baseName: string, excludeId?: string): string => {
    // Исключаем шаблон с excludeId из проверки (для случая переименования)
    const templatesToCheck = excludeId 
      ? templates.filter(t => t.id !== excludeId)
      : templates
    const existingNames = templatesToCheck.map(t => t.name)
    
    // Если базовое имя не существует, возвращаем его
    if (!existingNames.includes(baseName)) {
      return baseName
    }
    
    // Ищем следующее доступное имя с числовым суффиксом
    let counter = 1
    let newName = `${baseName} ${counter}`
    
    while (existingNames.includes(newName)) {
      counter++
      newName = `${baseName} ${counter}`
    }
    
    return newName
  }

  const saveTemplate = async () => {
    if (!senlerGroupIdW) return
    const templateName = generateUniqueTemplateName('шаблон')
    const newTemplate = await createIntegrationStepTemplates({settings: data, senlerGroupId: senlerGroupIdW, name: templateName})
    if (newTemplate.ok) setTemplates(p => [...p, newTemplate.data!])
  }

  const resaveTemplate = async (id: string) => {
    const name = prompt('Новое название шаблона', '');
    if (name) {
      const finalName = generateUniqueTemplateName(name, id)
      
      const res = await patchIntegrationStepTemplates({ name: finalName, settings: data }, id)

      if (res.ok) {
        console.log('renameTemplate')
        refreshTemplates()
      }
    }
  }

  return (
    <div className="text-left">
      <h3>Шаблон настроек</h3>
      <div className="flex items-center gap-3 my-3">
        <MySelectDropdown refreshTemplates={refreshTemplates} resaveTemplate={resaveTemplate} onValueChange={onChangeTemplate} options={templates.map(el => ({ value: el.id, label: el.name, id: el.id }))} isOpen={isOpen} setIsOpen={setIsOpen} />
        <button onClick={saveTemplate} className="px-4 py-2 bg-[#428BCA] hover:bg-[#025aa5] text-white rounded-md transition-colors duration-200">+</button>
      </div>
      <p className="ms-2 text-xs">Сохраняя настройки с выбранным шаблоном,<br/>вы изменяете шаблон, применяя настройку только на этот шаг</p>
    </div>
  )
}