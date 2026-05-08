import type { ReactElement, ReactNode } from "react"
import { useState } from "react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { QuizType } from "@/lib/content"
import { IconMoodSad, IconTrophy } from "@tabler/icons-react"

/**
 * Formats the correct answer for result feedback.
 *
 * @param quiz - Quiz being answered.
 * @returns Human-readable correct answer text.
 */
function getCorrectAnswer(quiz: QuizType): string {
  if (quiz.type === "choice") {
    const quotedAnswes = quiz.answers.map((answer) => `"${answer}"`)
    return quotedAnswes.join(", ")
  }

  const quotedBlanks = quiz.blanks.map((blank) => `"${blank}"`)
  return quotedBlanks.join(", ")
}

interface FillTextPart {
  blankIndex?: number
  text: string
}

/**
 * Splits fill quiz text around configured blanks in declaration order.
 *
 * @param text - Text containing the blank answer values.
 * @param blanks - Correct blank values to replace with inputs.
 * @returns Text and blank placeholder parts ready to render.
 */
function splitFillText(text: string, blanks: string[]): FillTextPart[] {
  const parts: FillTextPart[] = []
  let cursor = 0

  blanks.forEach((blank, blankIndex) => {
    const index = text.indexOf(blank, cursor)

    if (index === -1) {
      parts.push({ blankIndex, text: "" })
      return
    }

    if (index > cursor) {
      parts.push({ text: text.slice(cursor, index) })
    }

    parts.push({ blankIndex, text: "" })
    cursor = index + blank.length
  })

  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor) })
  }

  return parts
}

/**
 * Renders inputs for a fill-in-the-blanks quiz.
 *
 * @param quiz - Fill quiz configuration.
 * @param values - Current blank values.
 * @param onValueChange - Callback for updating a blank value.
 * @returns Inline fill quiz text with blank inputs.
 */
function renderFillQuiz(
  quiz: Extract<QuizType, { type: "fill" }>,
  values: string[],
  onValueChange: (index: number, value: string) => void,
): ReactNode {
  return splitFillText(quiz.text, quiz.blanks).map((part, index) => {
    if (part.blankIndex === undefined) {
      return (
        <span key={index} className="whitespace-pre tab-size-4 text-muted-foreground">
          {part.text}
        </span>
      )
    }

    const blankIndex = part.blankIndex

    return (
      <Input
        key={index}
        aria-label={`Blank ${blankIndex + 1}`}
        className="mx-1 inline-flex h-4 w-24 align-middle rounded-sm text-[1em]!"
        value={values[blankIndex] ?? ""}
        onChange={(event) => onValueChange(blankIndex, event.target.value)}
      />
    )
  })
}

/**
 * Compares two answer lists without requiring a specific selection order.
 *
 * @param selected - Values selected or entered by the user.
 * @param answers - Expected answer values.
 * @returns Whether both lists contain the same trimmed values.
 */
function areAnswersEqual(selected: string[], answers: string[]): boolean {
  const normalizedSelected = selected.map((answer) => answer.trim()).sort()
  const normalizedAnswers = answers.map((answer) => answer.trim()).sort()

  return (
    normalizedSelected.length === normalizedAnswers.length &&
    normalizedSelected.every((answer, index) => answer === normalizedAnswers[index])
  )
}

/**
 * Celebrates a correct quiz answer while respecting reduced-motion preferences.
 *
 * @returns Nothing.
 */
function launchCorrectAnswerConfetti(): void {
  void confetti({
    disableForReducedMotion: true,
    origin: { y: 0.72 },
    particleCount: 80,
    spread: 70,
  })
}

interface QuizProps {
  quiz: QuizType
}

/**
 * Renders one interactive quiz and reports the result in a dialog.
 *
 * @param props - Quiz configuration.
 * @returns Interactive quiz card footer content.
 */
export function Quiz({ quiz }: QuizProps): ReactElement {
  const [choiceAnswers, setChoiceAnswers] = useState<string[]>([])
  const [fillAnswers, setFillAnswers] = useState<string[]>(() =>
    quiz.type === "fill" ? quiz.blanks.map(() => "") : [],
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  /**
   * Opens the dialog showing the correct answer without changing the current answer state.
   */
  function showAnswer(): void {
    setIsAnswerDialogOpen(true)
  }

  /**
   * Checks the current answer and opens the feedback dialog.
   */
  function submitQuiz(): void {
    const correct =
      quiz.type === "choice" ? areAnswersEqual(choiceAnswers, quiz.answers) : areAnswersEqual(fillAnswers, quiz.blanks)

    setIsCorrect(correct)
    setIsDialogOpen(true)

    if (correct) {
      launchCorrectAnswerConfetti()
    }
  }

  /**
   * Updates one fill answer while preserving the other blank values.
   *
   * @param index - Blank index to update.
   * @param value - New blank value.
   */
  function setFillAnswer(index: number, value: string): void {
    setFillAnswers((current) => current.map((answer, currentIndex) => (currentIndex === index ? value : answer)))
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-2">
        <p className="font-medium leading-snug">{quiz.question}</p>
      </div>
      {quiz.type === "choice" ? (
        <ToggleGroup
          type="multiple"
          variant="outline"
          orientation="vertical"
          size="sm"
          spacing={1}
          className="flex w-full flex-wrap justify-start px-1"
          value={choiceAnswers}
          onValueChange={setChoiceAnswers}
        >
          {quiz.options.map((option) => (
            <ToggleGroupItem key={option} value={option} aria-label={option}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ) : (
        <div className="border border-border py-4 rounded-sm mx-1 overflow-x-auto">
          <p className="leading-5! tracking-tight text-nowrap mx-5 w-full inline-block">
            {renderFillQuiz(quiz, fillAnswers, setFillAnswer)}
          </p>
        </div>
      )}
      <div className="flex w-full gap-2 mt-3 mb-2">
        <Button size="sm" variant="default" type="button" className="flex-1" onClick={submitQuiz}>
          Submit
        </Button>
        <Button size="sm" variant="ghost" type="button" className="flex-1 underline" onClick={showAnswer}>
          Show Answer
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isCorrect ? "Correct!" : "Try again!"}</DialogTitle>
            <DialogDescription>
              <div className="flex justify-center items-center h-16">
                {isCorrect ? <IconTrophy /> : <IconMoodSad />}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
      <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Answer</DialogTitle>
            <DialogDescription>The correct answer is: {getCorrectAnswer(quiz)}</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </div>
  )
}
