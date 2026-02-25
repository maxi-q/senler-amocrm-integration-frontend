import { getSenlerGroupTemplates, integrationStepTemplate, createIntegrationStepTemplates, patchIntegrationStepTemplates } from "@/api/Backend/templates"
import { getUrlParams } from "@/helpers"
import { useEffect, useState, useCallback } from "react"
import { TemplatesDropdown } from "../ui/SelectFields"
import { generateUniqueTemplateName, normalizeAndSortTemplates } from "./helpers"

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
        const list = result.templates || []
        const sorted = normalizeAndSortTemplates(list)
        setTemplates(sorted)
        setSenlerGroupIdW(result.senlerGroupId)

        // Для старых шаблонов
        const hadNoIndex = (t: integrationStepTemplate) => {
          const orig = list.find((x) => x.id === t.id)
          return orig && typeof (orig.settings as { listIndex?: number })?.listIndex !== "number"
        }
        const toPersist = sorted.filter(hadNoIndex)

        if (toPersist.length > 0) {
          Promise.all(
            toPersist.map((t) =>
              patchIntegrationStepTemplates(
                { name: t.name, settings: { ...t.settings, listIndex: t.settings.listIndex } },
                t.id
              )
            )
          ).catch((e) => console.error("Failed to persist listIndex", e))
        }
      }
  }

  const reorderTemplates = useCallback(async (orderedIds: string[]) => {
    setTemplates((prev) => {
      const idToTemplate = new Map(prev.map((t) => [t.id, t]))
      const reordered = orderedIds
        .map((id) => idToTemplate.get(id))
        .filter(Boolean) as integrationStepTemplate[]
      if (reordered.length !== prev.length) return prev
      const withNewIndex = reordered.map((t, i) => ({
        ...t,
        settings: { ...t.settings, listIndex: i },
      }))
      queueMicrotask(() => { // для сохранения синхронности функции
        Promise.all(
          withNewIndex.map((t) =>
            patchIntegrationStepTemplates(
              { name: t.name, settings: { ...t.settings, listIndex: t.settings.listIndex } },
              t.id
            )
          )
        ).catch((e) => {
          console.error("Failed to save template order", e)
          refreshTemplates()
        })
      })
      return withNewIndex
    })
  }, [])

  useEffect(()=>{
    refreshTemplates()
  }, [])

  const saveTemplate = async () => {
    if (!senlerGroupIdW) return
    try {
      const templateName = generateUniqueTemplateName('шаблон', templates)
      const listIndex = templates.length
      const newTemplate = await createIntegrationStepTemplates({
        settings: { ...data, listIndex },
        senlerGroupId: senlerGroupIdW,
        name: templateName,
      })
      if (newTemplate.ok) setTemplates((p) => normalizeAndSortTemplates([...p, { ...newTemplate.data!, settings: { ...newTemplate.data!.settings, listIndex } }]))
    } catch (error) {
      console.error('Error generating unique template name:', error)
    }
  }

  const resaveTemplate = async (id: string) => {
    const name = prompt('Новое название шаблона', '');
    if (name) {
      try {
        const finalName = generateUniqueTemplateName(name, templates, id)
        
        const res = await patchIntegrationStepTemplates({ name: finalName, settings: data }, id)

        if (res.ok) {
          console.log('renameTemplate')
          refreshTemplates()
        }
      } catch (error) {
        console.error('Error generating unique template name:', error)
      }
    }
  }

  return (
    <div className="text-left">
      <h3>Шаблон настроек</h3>
      <div className="flex items-center gap-3 my-3">
        <TemplatesDropdown refreshTemplates={refreshTemplates} resaveTemplate={resaveTemplate} onValueChange={onChangeTemplate} onReorder={reorderTemplates} options={templates.map(el => ({ value: el.id, label: el.name, id: el.id }))} isOpen={isOpen} setIsOpen={setIsOpen} />
        <button onClick={saveTemplate} className="px-4 py-2 bg-[#428BCA] hover:bg-[#025aa5] text-white rounded-md transition-colors duration-200">+</button>
      </div>
      <p className="ms-2 text-xs">Сохраняя настройки с выбранным шаблоном,<br/>вы изменяете шаблон, применяя настройку только на этот шаг</p>
    </div>
  )
}


