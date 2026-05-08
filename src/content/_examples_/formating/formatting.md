---
category: Formatting
---

# Formatting Example

This card exists to check how common Markdown and inline HTML elements render inside a card. It includes short paragraphs, emphasis, links, lists, code, quotes, tables, and semantic HTML.

## Video Embedding

<iframe width="100%" height="auto" src="https://www.youtube.com/embed/kUs-fH1k-aM?si=Y8_1Za6ESDGPxvxm&amp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin"></iframe>

## Titles

# This is a H1 heading

## This is a H2 heading

### This is a H3 heading

#### This is a H4 heading

##### This is a H5 heading

###### This is a H6 heading

## Inline Text

Plain paragraph text should feel compact but still readable. This sentence includes **bold text**, _italic text_, `inline code`, ~~strikethrough~~, and a [link to Python](https://www.python.org/).

HTML inline elements: <mark>marked text</mark>, <kbd>Ctrl</kbd> + <kbd>K</kbd>, <abbr title="Application Programming Interface">API</abbr>, H<sub>2</sub>O, and x<sup>2</sup>.

This is some <large>large</large> text and some <small>small</small> text to check font size differences.

## Lists

This is a paragraph:

- Python basics
- Virtual environments
- Package management
- Testing and formatting

This is a paragraph:

1. Create a project folder.
2. Create a virtual environment.
3. Install dependencies.
4. Run the test suite.

## Blockquote

> Readability counts.
>
> Explicit is better than implicit.

## Code

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"


print(greet("Python"))
```

Inline code should sit naturally in text, like `python -m venv .venv` or `pytest`.

## Table

| Tool   | Purpose             | Command                |
| ------ | ------------------- | ---------------------- |
| venv   | Virtual environment | `python -m venv .venv` |
| pip    | Package installer   | `pip install requests` |
| pytest | Test runner         | `pytest`               |

## HTML Blocks

<div>
  <strong>HTML div content:</strong> useful for checking raw HTML spacing and inherited typography.
</div>

---

Final paragraph after a horizontal rule to verify section spacing near the bottom of the card.

<details>
  <summary>Details with summary tag</summary>
  <p>This paragraph is inside a native details element.</p>
</details>

<details>

Some details content to check spacing of the details element at the end of the card.

</details>
