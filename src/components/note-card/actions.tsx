import type { ReactElement } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { createCardTutorPrompt } from "@/lib/ai-chat/prompt"
import { copyTextToClipboard } from "@/lib/browser/clipboard"
import { cn } from "@/lib/utils"
import { IconCopy, IconLink, IconSparkles } from "@tabler/icons-react"

type CopyStatus = "idle" | "link-copied" | "link-error" | "prompt-copied" | "prompt-error"

interface NoteCardActionsProps {
  group: string
  category: string
  content: string
  permalinkUrl: string
  onAskAI: () => void
}

/**
 * Renders actions for a note card footer.
 *
 * @param props - Note card content and topic metadata.
 * @returns Footer actions for AI-related note card workflows.
 */
export function NoteCardActions({
  group,
  category,
  content,
  permalinkUrl,
  onAskAI,
}: NoteCardActionsProps): ReactElement {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")
  const prompt = createCardTutorPrompt({ group, category, content })

  async function copyPrompt(): Promise<void> {
    try {
      await copyTextToClipboard(prompt)
      setCopyStatus("prompt-copied")
    } catch {
      setCopyStatus("prompt-error")
    }
  }

  async function copyPermalink(): Promise<void> {
    try {
      await copyTextToClipboard(permalinkUrl)
      setCopyStatus("link-copied")
    } catch {
      setCopyStatus("link-error")
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" size="sm" variant="secondary" onClick={copyPermalink}>
              <IconLink className="text-muted-foreground" /> Copy link
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy card permalink</TooltipContent>
        </Tooltip>
      </div>
      {copyStatus !== "idle" ? (
        <p className={cn("text-xs", copyStatus.endsWith("error") && "text-destructive")} role="status">
          {copyStatus === "prompt-copied" ? "Copied." : null}
          {copyStatus === "prompt-error" ? "Unable to copy prompt." : null}
          {copyStatus === "link-copied" ? "Copied." : null}
          {copyStatus === "link-error" ? "Unable to copy link." : null}
        </p>
      ) : null}
    </CardFooter>
  )
}
