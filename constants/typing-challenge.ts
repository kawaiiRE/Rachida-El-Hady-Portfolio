import type {
  TypingDifficulty,
  TypingFingerGuide,
  TypingKeyboardKey,
} from '~/types/typing-challenge'

export const TYPING_CHALLENGE_LIMIT_MS = 5 * 60 * 1000
export const TYPING_SESSION_ATTEMPT_LIMIT = 25

export const TYPING_DIFFICULTIES: Array<{
  id: TypingDifficulty
  label: string
  description: string
}> = [
  { id: 'easy', label: 'Easy', description: 'lowercase letters' },
  { id: 'hard', label: 'Hard', description: 'capitals and punctuation' },
]

export const TYPING_PROMPTS: Record<TypingDifficulty, readonly string[]> = {
  easy: [
    'i build production web and mobile products with clean architecture and a sharp eye for details',
    'my strongest frontend work connects thoughtful interfaces with systems that stay clear as products grow',
    'i lead delivery while staying hands on with the code from planning and reviews through release',
    'i turn complex forms and data heavy screens into interfaces that feel calm and direct',
    'good motion explains hierarchy and rewards intent without slowing anyone down',
    'i work across vue nuxt react typescript and react native when the product needs range',
    'reliable products start with accessible controls responsive layouts and graceful edge case handling',
    'i like reusable logic honest collaboration and shipping ideas all the way to working software',
  ],
  hard: [
    'I build production interfaces in Vue, Nuxt, React, and TypeScript - then help teams ship them clearly.',
    'From PR review to release: I stay close to the code, the team, and the product.',
    '"Clarity before complexity" is how I shape scalable frontend systems; it is not just a phrase.',
    'My work spans SaaS, AI, analytics, React Native, and data-heavy tools - without losing the details.',
    'A reliable UI handles edge cases, respects accessibility, and still feels sharp at 2:00 a.m.',
    'When a product grows, I ask: is the architecture still clear, reusable, and easy to change?',
  ],
}

export const TYPING_SHIFTED_CHARACTERS: Record<string, string> = {
  '`': '~',
  '1': '!',
  '2': '@',
  '3': '#',
  '4': '$',
  '5': '%',
  '6': '^',
  '7': '&',
  '8': '*',
  '9': '(',
  '0': ')',
  '-': '_',
  '=': '+',
  '[': '{',
  ']': '}',
  '\\': '|',
  ';': ':',
  "'": '"',
  ',': '<',
  '.': '>',
  '/': '?',
}

export const TYPING_KEYBOARD_ROWS: TypingKeyboardKey[][] = [
  [
    { label: '`', secondaryLabel: '~', value: '`', finger: 'left-pinky' },
    { label: '1', secondaryLabel: '!', value: '1', finger: 'left-pinky' },
    { label: '2', secondaryLabel: '@', value: '2', finger: 'left-ring' },
    { label: '3', secondaryLabel: '#', value: '3', finger: 'left-middle' },
    { label: '4', secondaryLabel: '$', value: '4', finger: 'left-index' },
    { label: '5', secondaryLabel: '%', value: '5', finger: 'left-index' },
    { label: '6', secondaryLabel: '^', value: '6', finger: 'right-index' },
    { label: '7', secondaryLabel: '&', value: '7', finger: 'right-index' },
    { label: '8', secondaryLabel: '*', value: '8', finger: 'right-middle' },
    { label: '9', secondaryLabel: '(', value: '9', finger: 'right-ring' },
    { label: '0', secondaryLabel: ')', value: '0', finger: 'right-pinky' },
    { label: '-', secondaryLabel: '_', value: '-', finger: 'right-pinky' },
    { label: '=', secondaryLabel: '+', value: '=', finger: 'right-pinky' },
    {
      label: 'Bksp',
      value: 'Backspace',
      finger: 'right-pinky',
      size: 'backspace',
    },
  ],
  [
    { label: 'Tab', value: 'Tab', finger: 'left-pinky', size: 'tab' },
    { label: 'Q', value: 'q', finger: 'left-pinky' },
    { label: 'W', value: 'w', finger: 'left-ring' },
    { label: 'E', value: 'e', finger: 'left-middle' },
    { label: 'R', value: 'r', finger: 'left-index' },
    { label: 'T', value: 't', finger: 'left-index' },
    { label: 'Y', value: 'y', finger: 'right-index' },
    { label: 'U', value: 'u', finger: 'right-index' },
    { label: 'I', value: 'i', finger: 'right-middle' },
    { label: 'O', value: 'o', finger: 'right-ring' },
    { label: 'P', value: 'p', finger: 'right-pinky' },
    { label: '[', secondaryLabel: '{', value: '[', finger: 'right-pinky' },
    { label: ']', secondaryLabel: '}', value: ']', finger: 'right-pinky' },
    { label: '\\', secondaryLabel: '|', value: '\\', finger: 'right-pinky' },
  ],
  [
    { label: 'Caps', value: 'CapsLock', finger: 'left-pinky', size: 'caps' },
    { label: 'A', value: 'a', finger: 'left-pinky' },
    { label: 'S', value: 's', finger: 'left-ring' },
    { label: 'D', value: 'd', finger: 'left-middle' },
    { label: 'F', value: 'f', finger: 'left-index' },
    { label: 'G', value: 'g', finger: 'left-index' },
    { label: 'H', value: 'h', finger: 'right-index' },
    { label: 'J', value: 'j', finger: 'right-index' },
    { label: 'K', value: 'k', finger: 'right-middle' },
    { label: 'L', value: 'l', finger: 'right-ring' },
    { label: ';', secondaryLabel: ':', value: ';', finger: 'right-pinky' },
    { label: "'", secondaryLabel: '"', value: "'", finger: 'right-pinky' },
    { label: 'Enter', value: 'Enter', finger: 'right-pinky', size: 'enter' },
  ],
  [
    { label: 'Shift', value: 'Shift', finger: 'left-pinky', size: 'shift' },
    { label: 'Z', value: 'z', finger: 'left-pinky' },
    { label: 'X', value: 'x', finger: 'left-ring' },
    { label: 'C', value: 'c', finger: 'left-middle' },
    { label: 'V', value: 'v', finger: 'left-index' },
    { label: 'B', value: 'b', finger: 'left-index' },
    { label: 'N', value: 'n', finger: 'right-index' },
    { label: 'M', value: 'm', finger: 'right-index' },
    { label: ',', secondaryLabel: '<', value: ',', finger: 'right-middle' },
    { label: '.', secondaryLabel: '>', value: '.', finger: 'right-ring' },
    { label: '/', secondaryLabel: '?', value: '/', finger: 'right-pinky' },
    { label: 'Shift', value: 'Shift', finger: 'right-pinky', size: 'shift' },
  ],
  [
    { label: 'Ctrl', value: 'Control', finger: 'left-pinky', size: 'modifier' },
    { label: 'Alt', value: 'Alt', finger: 'thumb', size: 'modifier' },
    { label: 'Space', value: ' ', finger: 'thumb', size: 'space' },
    { label: 'Alt', value: 'AltGraph', finger: 'thumb', size: 'modifier' },
    { label: 'Ctrl', value: 'ControlRight', finger: 'right-pinky', size: 'modifier' },
  ],
]

export const TYPING_FINGER_GUIDE: TypingFingerGuide[] = [
  { finger: 'left-pinky', label: 'L pinky' },
  { finger: 'left-ring', label: 'L ring' },
  { finger: 'left-middle', label: 'L middle' },
  { finger: 'left-index', label: 'L index' },
  { finger: 'right-index', label: 'R index' },
  { finger: 'right-middle', label: 'R middle' },
  { finger: 'right-ring', label: 'R ring' },
  { finger: 'right-pinky', label: 'R pinky' },
]
