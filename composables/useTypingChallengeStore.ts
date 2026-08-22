import { useState } from '#imports'
import { readonly } from 'vue'
import { TYPING_SESSION_ATTEMPT_LIMIT } from '~/constants/typing-challenge'
import type { TypingAttempt, TypingDifficulty } from '~/types/typing-challenge'

export const useTypingChallengeStore = () => {
  const attempts = useState<TypingAttempt[]>('typing-challenge-attempts', () => [])

  const getDifficultyAttempts = (difficulty: TypingDifficulty): TypingAttempt[] =>
    attempts.value.filter((attempt) => attempt.difficulty === difficulty)

  const getAttemptCount = (difficulty: TypingDifficulty): number =>
    getDifficultyAttempts(difficulty).length

  const getAverageWpm = (difficulty: TypingDifficulty): number => {
    const difficultyAttempts = getDifficultyAttempts(difficulty)

    if (!difficultyAttempts.length) {
      return 0
    }

    const totalWpm = difficultyAttempts.reduce((total, attempt) => total + attempt.wpm, 0)

    return Math.round(totalWpm / difficultyAttempts.length)
  }

  const getBestWpm = (difficulty: TypingDifficulty): number =>
    getDifficultyAttempts(difficulty).reduce((best, attempt) => Math.max(best, attempt.wpm), 0)

  const recordAttempt = (attempt: TypingAttempt): void => {
    attempts.value = [...attempts.value, attempt].slice(-TYPING_SESSION_ATTEMPT_LIMIT)
  }

  return {
    attempts: readonly(attempts),
    getAttemptCount,
    getAverageWpm,
    getBestWpm,
    recordAttempt,
  }
}
