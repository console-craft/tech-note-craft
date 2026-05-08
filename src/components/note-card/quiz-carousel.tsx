import type { ReactElement } from "react"
import { useEffect, useState } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { Quiz } from "@/components/note-card/quiz"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { QuizType } from "@/lib/content"

interface QuizCarouselProps {
  quiz: QuizType[]
}

/**
 * Renders quizzes inside a carousel.
 *
 * @param props - Quiz entries to display.
 * @returns Carousel content for a note card.
 */
export function QuizCarousel({ quiz }: QuizCarouselProps): ReactElement {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isQuizOpen, setIsQuizOpen] = useState(false)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
  }, [api])

  return (
    <div className="-mx-3 mt-3 -mb-3 px-3 bg-muted/65 dark:bg-chart-3/65 border-t border-border">
      <Collapsible open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <CollapsibleTrigger className="w-full text-left">
          <h3 className="text-[1em]! text-primary uppercase font-semibold mb-2">{isQuizOpen ? "▼" : "▶"} Quiz</h3>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Carousel opts={{ align: "start" }} setApi={setApi} className="pb-3">
            <div className="w-full">
              <CarouselContent>
                {quiz.map((item, index) => (
                  <CarouselItem key={`${item.type}-${index}`}>
                    <Quiz quiz={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
            {quiz.length > 1 ? (
              <div className="mt-3 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  className="p-0 w-6 h-6 rounded-full"
                  disabled={current === 1}
                  onClick={() => {
                    if (api && api.canScrollPrev()) {
                      setCurrent((c) => c - 1)
                      api.scrollPrev()
                    }
                  }}
                >
                  <IconChevronLeft />
                </Button>
                <span>
                  {current} of {count}
                </span>
                <Button
                  variant="outline"
                  className="p-0 w-6 h-6 rounded-full"
                  disabled={current === count}
                  onClick={() => {
                    if (api && api.canScrollNext()) {
                      setCurrent((c) => c + 1)
                      api.scrollNext()
                    }
                  }}
                >
                  <IconChevronRight />
                </Button>
              </div>
            ) : null}
          </Carousel>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
