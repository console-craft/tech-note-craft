import type { KeyboardEvent, ReactElement } from "react"
import { IconBackspace, IconCopy, IconFileDownload } from "@tabler/icons-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface AIChatComposerActions {
  onClear: () => void
  onCopy: () => void
  onDownload: () => void
  onDraftChange: (value: string) => void
  onShortcut: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

interface AIChatComposerState {
  canSubmit: boolean
  copyStatus: string | null
  draft: string
  error: string | null
  hasMessages: boolean
  isConversationLoaded: boolean
  isPending: boolean
  isReadOnly: boolean
}

interface AIChatComposerProps {
  messageId: string
  state: AIChatComposerState
  actions: AIChatComposerActions
}

/**
 * Renders chat message actions and input controls.
 *
 * @param props - Composer state and action handlers.
 * @returns Message toolbar, textarea, errors, and submit button.
 */
export function AIChatComposer({ messageId, state, actions }: AIChatComposerProps): ReactElement {
  const { onClear, onCopy, onDownload, onDraftChange, onShortcut } = actions
  const { canSubmit, copyStatus, draft, error, hasMessages, isConversationLoaded, isPending, isReadOnly } = state

  return (
    <>
      <FieldGroup>
        <Field data-invalid={Boolean(error)}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor={messageId} className="inline-flex items-center gap-2">
              Message
              {isPending ? <Spinner data-icon="inline-end" /> : null}
              {copyStatus ? <span className="text-xs font-normal text-muted-foreground">{copyStatus}</span> : null}
            </FieldLabel>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Download chat messages"
                    disabled={!isConversationLoaded}
                    onClick={onDownload}
                  >
                    <IconFileDownload />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download chat messages</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Copy chat messages"
                    disabled={!isConversationLoaded || !hasMessages}
                    onClick={onCopy}
                  >
                    <IconCopy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy chat messages</TooltipContent>
              </Tooltip>
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Clear chat"
                        disabled={!isConversationLoaded || !hasMessages || isPending}
                      >
                        <IconBackspace className="text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Clear chat messages</TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear chat?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this saved chat. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction type="button" onClick={onClear}>
                      Clear chat
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <Textarea
            id={messageId}
            aria-invalid={Boolean(error)}
            className="max-h-40 min-h-24 resize-none"
            disabled={isReadOnly}
            placeholder={isReadOnly ? "This saved chat is read-only." : "Ask a question about this card..."}
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={onShortcut}
          />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={!canSubmit}>
        {isPending ? "Waiting for response..." : "Send message"}
      </Button>
    </>
  )
}
