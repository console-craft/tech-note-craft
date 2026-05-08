import type { ReactElement } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { createCardTutorPrompt } from "@/lib/ai-chat/prompt"
import { copyTextToClipboard } from "@/lib/browser/clipboard"
import { cn } from "@/lib/utils"
import { IconCopy, IconSparkles } from "@tabler/icons-react"

interface NoteCardActionsProps {
  group: string
  category: string
  content: string
  onAskAI: () => void
}

/**
 * Renders actions for a note card footer.
 *
 * @param props - Note card content and topic metadata.
 * @returns Footer actions for AI-related note card workflows.
 */
export function NoteCardActions({ group, category, content, onAskAI }: NoteCardActionsProps): ReactElement {
  const [copyStatus, setCopyStatus] = useState<"copied" | "error" | "idle">("idle")
  const prompt = createCardTutorPrompt({ group, category, content })

  async function copyPrompt(): Promise<void> {
    try {
      await copyTextToClipboard(prompt)
      setCopyStatus("copied")
    } catch {
      setCopyStatus("error")
    }
  }

  return (
    <CardFooter className="flex-wrap justify-between gap-2 text-muted-foreground">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" size="sm" variant="outline" onClick={onAskAI}>
              <IconSparkles className="text-muted-foreground" /> Ask AI
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send card to AI Chat</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" size="sm" variant="secondary" onClick={copyPrompt}>
              <IconCopy className="text-muted-foreground" /> Copy prompt
            </Button>
          </TooltipTrigger>
          <TooltipContent>Use in other AI apps</TooltipContent>
        </Tooltip>
      </div>
      {copyStatus !== "idle" ? (
        <p className={cn("text-xs", copyStatus === "error" && "text-destructive")} role="status">
          {copyStatus === "copied" ? "Prompt copied." : "Unable to copy prompt."}
        </p>
      ) : null}
    </CardFooter>
  )
}
