export const aiChatModels = ["gpt-4.1-mini", "gpt-5-mini"] as const
export type AIChatModel = (typeof aiChatModels)[number]
export const defaultAIChatModel = "gpt-4.1-mini" satisfies AIChatModel

/**
 * Checks whether a string is a supported AI chat model.
 *
 * @param value - Model value to validate.
 * @returns True when the value can be sent to the chat API.
 */
export function isAIChatModel(value: string): value is AIChatModel {
  return aiChatModels.some((model) => model === value)
}
