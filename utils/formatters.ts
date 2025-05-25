// Utility to parse text with asterisks (*) for highlighting

/**
 * Parses a string with asterisks (*) and returns parts for rendering
 * @param text String containing text with asterisks marking highlighted portions
 * @returns Array of objects with text and whether it should be highlighted
 */
export const parseHighlightedText = (text: string): { text: string; highlight: boolean }[] => {
  if (!text) return []

  const parts: { text: string; highlight: boolean }[] = []
  let isHighlighted = false
  let currentPart = ''

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '*') {
      if (currentPart) {
        parts.push({ text: currentPart, highlight: isHighlighted })
        currentPart = ''
      }
      isHighlighted = !isHighlighted
    } else {
      currentPart += text[i]
    }
  }

  if (currentPart) {
    parts.push({ text: currentPart, highlight: isHighlighted })
  }

  return parts
}

/**
 * Formats a question number as "Q1.", "Q2.", etc.
 */
export const formatQuestionNumber = (num: number): string => {
  return `Q${num + 1}.`
}
