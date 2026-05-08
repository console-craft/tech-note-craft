import type { ReactElement } from "react"
import { useState } from "react"
import { IconQuestionMark } from "@tabler/icons-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { aiChatModels, type AIChatModel } from "@/lib/ai-chat/models"

interface AIChatSettingsProps {
  apiKey: string
  apiKeyId: string
  model: AIChatModel
  modelId: string
  onApiKeyChange: (value: string) => void
  onModelChange: (value: string) => void
}

/**
 * Renders AI chat configuration controls.
 *
 * @param props - Current model, API key, field IDs, and change handlers.
 * @returns Model selector and API key field.
 */
export function AIChatSettings({
  apiKey,
  apiKeyId,
  model,
  modelId,
  onApiKeyChange,
  onModelChange,
}: AIChatSettingsProps): ReactElement {
  const [isApiKeyHelpOpen, setIsApiKeyHelpOpen] = useState(false)
  const [isModelHelpOpen, setIsModelHelpOpen] = useState(false)

  return (
    <FieldGroup className="grid gap-4 md:grid-cols-2">
      <Field className="grid grid-cols-[5.5rem_1fr] items-center gap-3 md:flex md:items-stretch">
        <div className="flex w-fit items-center gap-1.5 whitespace-nowrap">
          <FieldLabel htmlFor={modelId}>AI model</FieldLabel>
          <Tooltip open={isModelHelpOpen} onOpenChange={setIsModelHelpOpen}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="AI model help"
                className="inline-flex size-4 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setIsModelHelpOpen((current) => !current)}
              >
                <IconQuestionMark className="size-3" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Use GPT-4.1-mini (default) for most questions, since it provides quick explanations and simple coding help
              for popular languages. Use GPT-5-mini when you need deeper reasoning, or more careful step-by-step
              tutoring.
            </TooltipContent>
          </Tooltip>
        </div>
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger id={modelId} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {aiChatModels.map((availableModel) => (
                <SelectItem key={availableModel} value={availableModel}>
                  {availableModel}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field className="grid grid-cols-[5.5rem_1fr] items-center gap-3 md:flex md:items-stretch">
        <div className="flex w-fit items-center gap-1.5 whitespace-nowrap">
          <FieldLabel htmlFor={apiKeyId}>API key</FieldLabel>
          <Tooltip open={isApiKeyHelpOpen} onOpenChange={setIsApiKeyHelpOpen}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="API key help"
                className="inline-flex size-4 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setIsApiKeyHelpOpen((current) => !current)}
              >
                <IconQuestionMark className="size-3" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Your API key is stored only in this tab's session storage and used for sending messages securely to the AI
              agent. It will be discarded when you close the tab. For extra security, you can also create and use a
              disposable API key.
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id={apiKeyId}
          type="password"
          autoComplete="off"
          placeholder="sk-..."
          value={apiKey}
          onChange={(event) => onApiKeyChange(event.target.value)}
        />
      </Field>
    </FieldGroup>
  )
}
