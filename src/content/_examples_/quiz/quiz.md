---
category: Quizz
order: 1
quiz:
  - type: choice
    question: Which keyword defines a function in Python?
    options: [def, define, function]
    answers: [def]

  - type: choice
    question: Which Python data types maintain elements order?
    options: [lists, tuples, sets, dictionaries]
    answers: [lists, tuples, dictionaries]

  - type: fill
    question: "The correct code to read a file in Python is:"
    text: "def load_data(mode: str):\n\twith open('file.txt', mode) as f:\n\t\tprint(f.read())"
    blanks: [str, open, read]
---

# Quiz Example

A card with a quiz. The content of the quiz is defined in the front-matter of the markdown content. The first two questions are multiple choice, and the last one is a fill-in-the-blank question.
