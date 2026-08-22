export type TypingChallengeStatus = 'idle' | 'ready' | 'running' | 'completed' | 'timeout'

export type TypingDifficulty = 'easy' | 'hard'

export type TypingFinger =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb'

export interface TypingKeyboardKey {
  label: string
  value: string
  finger: TypingFinger
  secondaryLabel?: string
  size?: 'modifier' | 'tab' | 'caps' | 'enter' | 'shift' | 'backspace' | 'space'
}

export interface TypingFingerGuide {
  finger: TypingFinger
  label: string
}

export interface TypingAttempt {
  difficulty: TypingDifficulty
  wpm: number
  accuracy: number
  durationMs: number
  completed: boolean
}
