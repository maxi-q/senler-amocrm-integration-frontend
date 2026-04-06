import {
  getSenlerGroupTemplates,
  integrationStepTemplate,
  createIntegrationStepTemplates,
  patchIntegrationStepTemplates,
} from "@/api/Backend/templates"
import { getUrlParams, useDebounceCallback } from "@/helpers"
import useAccountStore from "@/store/account"
import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import { TemplatesDropdown } from "./ui/TemplateDropdown"
import {
  generateUniqueTemplateName,
  normalizeAndSortTemplates,
  normalizeAmoDomain,
  filterTemplatesByAmoDomain,
} from "./helpers"

interface ITemplates {
  data?: any
  setData: (mockMessage?: { private: any; public: any }) => void
}

export const Templates = ({ data, setData }: ITemplates) => {
  const amoCrmDomainName = useAccountStore((s) => s.senlerGroup.amoCrmDomainName)

  const [allTemplates, setAllTemplates] = useState<integrationStepTemplate[]>([])
  const allTemplatesRef = useRef(allTemplates)
  allTemplatesRef.current = allTemplates

  /** Защита от гонок: устаревшие ответы fetch не обновляют state. */
  const refreshGenerationRef = useRef(0)

  const visibleTemplates = useMemo(() => {
    const domain = normalizeAmoDomain(amoCrmDomainName)
    if (!domain) return []
    return normalizeAndSortTemplates(filterTemplatesByAmoDomain(allTemplates, domain))
  }, [allTemplates, amoCrmDomainName])

  const visibleRef = useRef(visibleTemplates)
  visibleRef.current = visibleTemplates

  const [senlerGroupIdW, setSenlerGroupIdW] = useState<string>()
  const { senlerGroupId } = getUrlParams()
  const [isOpen, setIsOpen] = useState(false)
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)

  const onChangeTemplate = useCallback(
    (templateId: string) => {
      if (!templateId) {
        return
      }
      const template = visibleTemplates.find((el) => el.id === templateId)
      if (template?.settings) {
        setData(template.settings)
      }
    },
    [visibleTemplates, setData]
  )

  const refreshTemplates = useCallback(async () => {
    const id = senlerGroupId?.trim()
    if (!id) {
      refreshGenerationRef.current += 1
      setAllTemplates([])
      setSenlerGroupIdW(undefined)
      return
    }

    const gen = ++refreshGenerationRef.current

    const result = await getSenlerGroupTemplates({ senlerGroupId: id })
    if (gen !== refreshGenerationRef.current) return
    if (!result.ok) return

    const list = result.templates || []
    const domainForMigration =
      normalizeAmoDomain(result.amoCrmDomainName) ||
      normalizeAmoDomain(useAccountStore.getState().senlerGroup.amoCrmDomainName)

    let merged = list

    if (domainForMigration) {
      const toMigrate = list.filter(
        (t) => !normalizeAmoDomain(t.settings?.amoCrmDomainName as string | undefined)
      )
      if (toMigrate.length > 0) {
        try {
          await Promise.all(
            toMigrate.map((t) =>
              patchIntegrationStepTemplates(
                {
                  name: t.name,
                  settings: {
                    ...t.settings,
                    amoCrmDomainName: domainForMigration,
                  },
                },
                t.id
              )
            )
          )
          if (gen !== refreshGenerationRef.current) return
          merged = list.map((t) =>
            toMigrate.some((m) => m.id === t.id)
              ? {
                  ...t,
                  settings: { ...t.settings, amoCrmDomainName: domainForMigration },
                }
              : t
          )
        } catch (e) {
          console.error("Failed to migrate template amoCrmDomainName", e)
        }
      }
    }

    if (gen !== refreshGenerationRef.current) return

    const sorted = normalizeAndSortTemplates(merged)
    setAllTemplates(sorted)
    setSenlerGroupIdW(result.senlerGroupId)

    const hadNoIndex = (t: integrationStepTemplate) => {
      const orig = merged.find((x) => x.id === t.id)
      return orig && typeof (orig.settings as { listIndex?: number })?.listIndex !== "number"
    }
    const toPersist = sorted.filter(hadNoIndex)
    if (toPersist.length > 0) {
      Promise.all(
        toPersist.map((t) =>
          patchIntegrationStepTemplates(
            {
              name: t.name,
              settings: { ...t.settings, listIndex: t.settings.listIndex },
            },
            t.id
          )
        )
      ).catch((e) => console.error("Failed to persist listIndex", e))
    }
  }, [senlerGroupId])

  const persistOrderToBackend = useCallback(
    (withNewIndex: integrationStepTemplate[]) => {
      Promise.all(
        withNewIndex.map((t) =>
          patchIntegrationStepTemplates(
            {
              name: t.name,
              settings: { ...t.settings, listIndex: t.settings.listIndex },
            },
            t.id
          )
        )
      ).catch((e) => {
        console.error("Failed to save template order", e)
        void refreshTemplates()
      })
    },
    [refreshTemplates]
  )

  const debouncedPersistOrder = useDebounceCallback(persistOrderToBackend, 1500)
  const debouncedPersistOrderRef = useRef(debouncedPersistOrder)
  debouncedPersistOrderRef.current = debouncedPersistOrder

  const reorderTemplates = useCallback((orderedIds: string[]) => {
    const domain = normalizeAmoDomain(useAccountStore.getState().senlerGroup.amoCrmDomainName)
    if (!domain) return

    const prev = visibleRef.current
    const idToTemplate = new Map(prev.map((t) => [t.id, t]))
    const reordered = orderedIds
      .map((id) => idToTemplate.get(id))
      .filter(Boolean) as integrationStepTemplate[]
    if (reordered.length !== prev.length) return

    const others = allTemplatesRef.current.filter(
      (t) => normalizeAmoDomain(t.settings?.amoCrmDomainName as string | undefined) !== domain
    )

    const withNewIndex = reordered.map((t, i) => ({
      ...t,
      settings: { ...t.settings, listIndex: i },
    }))

    const merged = [...others, ...withNewIndex]
    const next = normalizeAndSortTemplates(merged)
    setAllTemplates(next)
    allTemplatesRef.current = next

    debouncedPersistOrderRef.current(withNewIndex)
  }, [])

  useEffect(() => {
    void refreshTemplates()
  }, [refreshTemplates])

  useEffect(() => {
    return () => {
      refreshGenerationRef.current += 1
    }
  }, [])

  const saveTemplate = async () => {
    if (!senlerGroupIdW || isSavingTemplate) return
    const domain = normalizeAmoDomain(amoCrmDomainName)
    if (!domain) return

    setIsSavingTemplate(true)
    try {
      const templateName = generateUniqueTemplateName("шаблон", visibleTemplates)
      const listIndex = visibleTemplates.length
      const newTemplate = await createIntegrationStepTemplates({
        settings: { ...data, listIndex, amoCrmDomainName: domain },
        senlerGroupId: senlerGroupIdW,
        name: templateName,
      })
      if (newTemplate.ok && newTemplate.data) {
        const row: integrationStepTemplate = {
          ...newTemplate.data,
          settings: {
            ...newTemplate.data.settings,
            listIndex,
            amoCrmDomainName: domain,
          },
        }
        setAllTemplates((p) => normalizeAndSortTemplates([...p, row]))
      }
    } catch (error) {
      console.error("Error generating unique template name:", error)
    } finally {
      setIsSavingTemplate(false)
    }
  }

  const resaveTemplate = async (id: string) => {
    const name = prompt("Новое название шаблона", "")
    if (!name?.trim()) return

    try {
      const prev = visibleRef.current
      const template = prev.find((t) => t.id === id)
      if (!template) return

      const finalName = generateUniqueTemplateName(name.trim(), prev, id)
      const res = await patchIntegrationStepTemplates(
        {
          name: finalName,
          settings: { ...(template.settings ?? {}) },
        },
        id
      )

      if (res.ok) {
        setAllTemplates((current) =>
          current.map((t) => (t.id === id ? { ...t, name: finalName } : t))
        )
      }
    } catch (error) {
      console.error("Error generating unique template name:", error)
    }
  }

  const domainLabel = normalizeAmoDomain(amoCrmDomainName)

  return (
    <div className="text-left">
      <h3>Шаблон настроек</h3>
      <p className="text-xs text-gray-600 mb-2">
        Шаблоны привязаны к текущему аккаунту amoCRM
        {domainLabel ? <> ({domainLabel})</> : null}. При смене аккаунта список меняется.
      </p>
      <div className="flex items-center gap-3 my-3">
        <TemplatesDropdown
          key={domainLabel || "no-domain"}
          refreshTemplates={refreshTemplates}
          resaveTemplate={resaveTemplate}
          onValueChange={onChangeTemplate}
          onReorder={reorderTemplates}
          options={visibleTemplates.map((el) => ({
            value: el.id,
            label: el.name,
            id: el.id,
          }))}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <button
          type="button"
          onClick={saveTemplate}
          disabled={!domainLabel || isSavingTemplate}
          className="px-4 py-2 bg-[#428BCA] hover:bg-[#025aa5] text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
      <p className="ms-2 text-xs">
        Сохраняя настройки с выбранным шаблоном,
        <br />
        вы изменяете шаблон, применяя настройку только на этот шаг
      </p>
    </div>
  )
}
