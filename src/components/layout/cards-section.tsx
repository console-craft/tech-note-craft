import type { ReactElement, RefObject } from "react"
import { useEffect, useRef, useState } from "react"
import { IconBackspace } from "@tabler/icons-react"
import { NoteCard } from "@/components/note-card"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Note } from "@/lib/content"
import { cn } from "@/lib/utils"
import type { ActiveAIChat } from "@/components/ai-chat"

const ALL_FILTER_VALUE = "__all__"

interface CardColumnItem {
  note: Note
}

/**
 * Splits notes into deterministic independent columns.
 *
 * @param noteList - Notes to split into columns.
 * @param columnCount - Number of columns to generate.
 * @returns Responsive columns of note/index pairs.
 */
function splitNotesIntoColumns(noteList: Note[], columnCount: 1 | 2 | 3): CardColumnItem[][] {
  const columns = Array.from({ length: columnCount }, () => [] as CardColumnItem[])

  noteList.forEach((note, index) => {
    columns[index % columnCount].push({ note })
  })

  return columns
}

/**
 * Gets the number of columns that fit comfortably inside the notes container.
 *
 * @param width - Current notes container width in pixels.
 * @returns The responsive column count.
 */
function getColumnCount(width: number): 1 | 2 | 3 {
  if (width >= 1180) {
    return 3
  }

  if (width >= 760) {
    return 2
  }

  return 1
}

/**
 * Tracks the responsive column count for a container element.
 *
 * @param ref - Container element ref to observe.
 * @returns Current column count for the container width.
 */
function useResponsiveColumnCount(ref: RefObject<HTMLDivElement | null>): 1 | 2 | 3 {
  const [columnCount, setColumnCount] = useState<1 | 2 | 3>(1)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      setColumnCount(getColumnCount(entry.contentRect.width))
    })

    observer.observe(ref.current)
    setColumnCount(getColumnCount(ref.current.getBoundingClientRect().width))

    return () => {
      observer.disconnect()
    }
  }, [ref])

  return columnCount
}

interface CardColumnsProps {
  notes: Note[]
  onNavigate: (to: string) => void
  getIsCardExpanded: (cardId: string) => boolean
  onCardExpandedChange: (cardId: string, isExpanded: boolean) => void
  onAIChatOpen: (chat: ActiveAIChat) => void
}

/**
 * Renders notes in independent desktop columns with original single-column mobile ordering.
 *
 * @param props - Notes and shared card expansion controls.
 * @returns A responsive notes layout.
 */
function CardColumns({
  notes: noteList,
  onNavigate,
  getIsCardExpanded,
  onCardExpandedChange,
  onAIChatOpen,
}: CardColumnsProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const columnCount = useResponsiveColumnCount(containerRef)
  const columns = splitNotesIntoColumns(noteList, columnCount)

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid items-start gap-10",
        columnCount === 1 && "grid-cols-1",
        columnCount === 2 && "grid-cols-2",
        columnCount === 3 && "grid-cols-3",
      )}
    >
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-10">
          {column.map(({ note }) => (
            <NoteCard
              key={note.id}
              cardId={note.id}
              group={note.group}
              category={note.category}
              content={note.content}
              order={note.order}
              quiz={note.quiz}
              isExpanded={getIsCardExpanded(note.id)}
              onAIChatOpen={onAIChatOpen}
              onExpandedChange={(isExpanded) => onCardExpandedChange(note.id, isExpanded)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Formats a group slug for display in filter controls.
 *
 * @param group - Content group slug.
 * @returns Human-readable group label.
 */
function formatGroupLabel(group: string): string {
  return group.replace(/(^|-)([a-z])/g, (_, separator: string, letter: string) => {
    return `${separator ? " " : ""}${letter.toUpperCase()}`
  })
}

/**
 * Gets the rendered card title from markdown content.
 *
 * @param content - Full markdown card content.
 * @returns First markdown heading text, or a fallback title when absent.
 */
function getNoteTitle(content: string): string {
  const headingMatch = content.match(/^#{1,6}\s+(.+)$/m)

  return headingMatch?.[1] ?? "Untitled note"
}

/**
 * Gets sorted unique note field values.
 *
 * @param noteList - Notes to inspect.
 * @param field - Note field to collect.
 * @returns Sorted unique field values.
 */
function getUniqueNoteValues(noteList: Note[], field: "category" | "group"): string[] {
  return Array.from(new Set(noteList.map((note) => note[field]))).sort((left, right) => left.localeCompare(right))
}

interface CardsSectionProps {
  notes: Note[]
  showFilter?: boolean
  showGroupFilter?: boolean
  getIsCardExpanded: (cardId: string) => boolean
  onAIChatOpen: (chat: ActiveAIChat) => void
  onCardExpandedChange: (cardId: string, isExpanded: boolean) => void
  onNavigate: (to: string) => void
}

/**
 * Renders a filterable list of note cards.
 *
 * @param props - Notes, expansion controls, and filter visibility.
 * @returns A note section with an optional title filter.
 */
export function CardsSection({
  notes,
  showFilter = false,
  showGroupFilter = false,
  getIsCardExpanded,
  onAIChatOpen,
  onCardExpandedChange,
  onNavigate,
}: CardsSectionProps): ReactElement {
  const [filterText, setFilterText] = useState("")
  const [groupFilter, setGroupFilter] = useState(ALL_FILTER_VALUE)
  const groupOptions = getUniqueNoteValues(notes, "group")
  const hasActiveFilter = filterText.length > 0 || groupFilter !== ALL_FILTER_VALUE

  const filteredNotes = notes.filter((note) => {
    const query = filterText.toLowerCase()
    const titleMatches = getNoteTitle(note.content).toLowerCase().includes(query)
    const categoryMatches = note.category.toLowerCase().includes(query)
    const groupMatches = groupFilter === ALL_FILTER_VALUE || note.group === groupFilter

    return (titleMatches || categoryMatches) && groupMatches
  })

  function clearFilters(): void {
    setFilterText("")
    setGroupFilter(ALL_FILTER_VALUE)
  }

  return (
    <div className="flex flex-col gap-6">
      {showFilter ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <ButtonGroup aria-label="Filter note cards" className="w-full">
            <Input
              aria-label="Filter note cards by title"
              placeholder="Filter by title or category..."
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Clear note filters"
              disabled={!hasActiveFilter}
              onClick={clearFilters}
            >
              <IconBackspace />
            </Button>
          </ButtonGroup>
          {showGroupFilter ? (
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger aria-label="Filter by language" className="w-full sm:w-40">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={ALL_FILTER_VALUE}>All languages</SelectItem>
                  {groupOptions.map((group) => (
                    <SelectItem key={group} value={group}>
                      {formatGroupLabel(group)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : null}
        </div>
      ) : null}
      <CardColumns
        notes={filteredNotes}
        onNavigate={onNavigate}
        getIsCardExpanded={getIsCardExpanded}
        onCardExpandedChange={onCardExpandedChange}
        onAIChatOpen={onAIChatOpen}
      />
    </div>
  )
}
