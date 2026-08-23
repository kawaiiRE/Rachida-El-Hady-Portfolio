import { computed, onBeforeUnmount, ref } from 'vue'
import {
  TYPING_CHALLENGE_LIMIT_MS,
  TYPING_DIFFICULTIES,
  TYPING_FINGER_GUIDE,
  TYPING_KEYBOARD_ROWS,
  TYPING_PROMPTS,
  TYPING_SHIFTED_CHARACTERS,
} from '~/constants/typing-challenge'
import type { TypingChallengeStatus, TypingDifficulty } from '~/types/typing-challenge'

const PRESSED_KEY_DURATION_MS = 130
const MILLISECONDS_PER_MINUTE = 60_000
const CHARACTERS_PER_WORD = 5

const UNSHIFTED_CHARACTERS = Object.fromEntries(
  Object.entries(TYPING_SHIFTED_CHARACTERS).map(([baseCharacter, shiftedCharacter]) => [
    shiftedCharacter,
    baseCharacter,
  ]),
) as Record<string, string>

const getKeyboardBaseKey = (key: string): string => {
  if (key === 'Spacebar') {
    return ' '
  }

  if (UNSHIFTED_CHARACTERS[key]) {
    return UNSHIFTED_CHARACTERS[key]
  }

  return key.length === 1 ? key.toLowerCase() : key
}

const requiresShift = (character: string): boolean =>
  (character.length === 1 && character >= 'A' && character <= 'Z') ||
  Boolean(UNSHIFTED_CHARACTERS[character])

const formatDuration = (durationMs: number): string => {
  const safeDuration = Math.max(0, Math.min(durationMs, TYPING_CHALLENGE_LIMIT_MS))
  const minutes = Math.floor(safeDuration / MILLISECONDS_PER_MINUTE)
  const seconds = Math.floor((safeDuration % MILLISECONDS_PER_MINUTE) / 1000)
  const milliseconds = Math.floor(safeDuration % 1000)

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`
}

export const useTypingChallenge = () => {
  // -------------------- Composables --------------------
  const typingStore = useTypingChallengeStore()

  // -------------------- State --------------------
  const captureInputRef = ref<HTMLInputElement | null>(null)
  const status = ref<TypingChallengeStatus>('idle')
  const difficulty = ref<TypingDifficulty>('easy')
  const currentPrompt = ref<string>(TYPING_PROMPTS.easy[0] ?? '')
  const typedText = ref('')
  const elapsedMs = ref(0)
  const totalKeystrokes = ref(0)
  const correctKeystrokes = ref(0)
  const pressedKey = ref('')
  const isKeyHintEnabled = ref(false)
  let timerFrameId = 0
  let startTimestamp = 0
  let pressedKeyTimeout: ReturnType<typeof setTimeout> | null = null

  // -------------------- Computed --------------------
  const promptCharacters = computed(() => Array.from(currentPrompt.value))
  const typedCharacters = computed(() => Array.from(typedText.value))
  const difficultyLabel = computed(
    () =>
      TYPING_DIFFICULTIES.find((difficultyOption) => difficultyOption.id === difficulty.value)
        ?.label ?? 'Easy',
  )
  const isChallengeActive = computed(() => status.value === 'ready' || status.value === 'running')
  const attemptCount = computed(() => typingStore.getAttemptCount(difficulty.value))
  const averageWpm = computed(() => typingStore.getAverageWpm(difficulty.value))
  const bestWpm = computed(() => typingStore.getBestWpm(difficulty.value))
  const correctCharacterCount = computed(() =>
    typedCharacters.value.reduce(
      (count, character, index) =>
        character === promptCharacters.value[index] ? count + 1 : count,
      0,
    ),
  )
  const currentWpm = computed(() => {
    if (status.value === 'idle' || status.value === 'ready') {
      return 0
    }

    const elapsedMinutes = Math.max(elapsedMs.value, 1000) / MILLISECONDS_PER_MINUTE
    const wordsTyped = correctCharacterCount.value / CHARACTERS_PER_WORD

    return Math.round(wordsTyped / elapsedMinutes)
  })
  const accuracy = computed(() => {
    if (!totalKeystrokes.value) {
      return 100
    }

    return Math.round((correctKeystrokes.value / totalKeystrokes.value) * 100)
  })
  const progress = computed(() =>
    Math.min((typedCharacters.value.length / promptCharacters.value.length) * 100, 100),
  )
  const nextKey = computed(() => promptCharacters.value[typedCharacters.value.length] ?? '')
  const shouldHintShift = computed(() => requiresShift(nextKey.value))
  const buttonLabel = computed(() => {
    if (status.value === 'idle') {
      return 'Start challenge'
    }

    if (status.value === 'completed' || status.value === 'timeout') {
      return 'Try another'
    }

    return 'Restart'
  })
  const isTimerRunning = computed(() => status.value === 'running')
  const timerStateLabel = computed(() => {
    if (status.value === 'ready') {
      return 'Waiting for first key'
    }

    if (status.value === 'running') {
      return 'Live timer'
    }

    if (status.value === 'completed') {
      return 'Final time'
    }

    if (status.value === 'timeout') {
      return 'Time limit reached'
    }

    return 'Timer ready'
  })
  const statusMessage = computed(() => {
    if (status.value === 'ready') {
      return 'Prompt ready. Your first character starts the clock.'
    }

    if (status.value === 'running') {
      const remaining = Math.max(promptCharacters.value.length - typedCharacters.value.length, 0)

      return `${remaining} character${remaining === 1 ? '' : 's'} to go.`
    }

    if (status.value === 'completed') {
      return `Complete — ${currentWpm.value} WPM at ${accuracy.value}% accuracy. Press Enter for another.`
    }

    if (status.value === 'timeout') {
      return 'Time is up — the five-minute safety limit stopped this run.'
    }

    return 'Press start to test your typing skills and set a score worth beating.'
  })
  const formattedElapsed = computed(() => formatDuration(elapsedMs.value))
  const formattedLimit = formatDuration(TYPING_CHALLENGE_LIMIT_MS)

  // -------------------- Methods --------------------
  const cancelTimer = (): void => {
    window.cancelAnimationFrame(timerFrameId)
    timerFrameId = 0
  }

  const finishChallenge = (result: 'completed' | 'timeout'): void => {
    if (status.value !== 'running') {
      return
    }

    elapsedMs.value = Math.min(performance.now() - startTimestamp, TYPING_CHALLENGE_LIMIT_MS)
    cancelTimer()
    status.value = result
    typingStore.recordAttempt({
      difficulty: difficulty.value,
      wpm: currentWpm.value,
      accuracy: accuracy.value,
      durationMs: Math.round(elapsedMs.value),
      completed: result === 'completed',
    })
  }

  const updateTimer = (timestamp: number): void => {
    elapsedMs.value = Math.min(timestamp - startTimestamp, TYPING_CHALLENGE_LIMIT_MS)

    if (elapsedMs.value >= TYPING_CHALLENGE_LIMIT_MS) {
      finishChallenge('timeout')

      return
    }

    timerFrameId = window.requestAnimationFrame(updateTimer)
  }

  const startTimer = (): void => {
    if (status.value !== 'ready') {
      return
    }

    status.value = 'running'
    startTimestamp = performance.now()
    timerFrameId = window.requestAnimationFrame(updateTimer)
  }

  const showPressedKey = (key: string): void => {
    pressedKey.value = key

    if (pressedKeyTimeout) {
      clearTimeout(pressedKeyTimeout)
    }

    pressedKeyTimeout = setTimeout(() => {
      pressedKey.value = ''
      pressedKeyTimeout = null
    }, PRESSED_KEY_DURATION_MS)
  }

  const focusCaptureInput = (): void => {
    captureInputRef.value?.focus({ preventScroll: true })
  }

  const choosePrompt = (): string => {
    const promptPool = TYPING_PROMPTS[difficulty.value]
    const choices = promptPool.filter((prompt) => prompt !== currentPrompt.value)
    const randomIndex = Math.floor(Math.random() * choices.length)

    return choices[randomIndex] ?? promptPool[0] ?? ''
  }

  const startChallenge = (): void => {
    cancelTimer()
    currentPrompt.value = choosePrompt()
    typedText.value = ''
    elapsedMs.value = 0
    totalKeystrokes.value = 0
    correctKeystrokes.value = 0
    pressedKey.value = ''
    status.value = 'ready'
    focusCaptureInput()
  }

  const selectDifficulty = (nextDifficulty: TypingDifficulty): void => {
    if (isChallengeActive.value || difficulty.value === nextDifficulty) {
      return
    }

    difficulty.value = nextDifficulty
    currentPrompt.value = TYPING_PROMPTS[nextDifficulty][0] ?? ''
    typedText.value = ''
    elapsedMs.value = 0
    totalKeystrokes.value = 0
    correctKeystrokes.value = 0
    status.value = 'idle'
  }

  const toggleKeyHint = (): void => {
    isKeyHintEnabled.value = !isKeyHintEnabled.value

    if (isChallengeActive.value) {
      focusCaptureInput()
    }
  }

  const removeLastCharacter = (): void => {
    if (!isChallengeActive.value || !typedText.value.length) {
      return
    }

    typedText.value = typedCharacters.value.slice(0, -1).join('')
  }

  const enterCharacter = (rawCharacter: string): void => {
    if (!isChallengeActive.value) {
      return
    }

    const character = rawCharacter
    if (character.length !== 1 || typedCharacters.value.length >= promptCharacters.value.length) {
      return
    }

    if (status.value === 'ready') {
      startTimer()
    }

    showPressedKey(getKeyboardBaseKey(character))
    totalKeystrokes.value += 1

    if (character === nextKey.value) {
      correctKeystrokes.value += 1
    }

    typedText.value += character

    if (typedCharacters.value.length >= promptCharacters.value.length) {
      finishChallenge('completed')
    }
  }

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return
    }

    const key = event.key === 'Spacebar' ? ' ' : event.key

    if (key === 'Enter' && (status.value === 'completed' || status.value === 'timeout')) {
      event.preventDefault()
      startChallenge()
      showPressedKey('Enter')

      return
    }

    if (!isChallengeActive.value) {
      return
    }

    if (key === 'Backspace') {
      event.preventDefault()
      showPressedKey('Backspace')
      removeLastCharacter()

      return
    }

    if (key === 'Shift' || key === 'CapsLock' || key === 'Enter') {
      showPressedKey(key)

      return
    }

    if (key.length === 1) {
      event.preventDefault()
      enterCharacter(key)
    }
  }

  const handleBeforeInput = (event: Event): void => {
    if (!isChallengeActive.value) {
      return
    }

    const inputEvent = event as InputEvent
    inputEvent.preventDefault()

    if (inputEvent.inputType === 'deleteContentBackward') {
      showPressedKey('Backspace')
      removeLastCharacter()

      return
    }

    if (inputEvent.inputType !== 'insertText' || inputEvent.data?.length !== 1) {
      return
    }

    enterCharacter(inputEvent.data)
  }

  const clearCaptureInput = (): void => {
    if (captureInputRef.value) {
      captureInputRef.value.value = ''
    }
  }

  const getCharacterClasses = (character: string, index: number): Record<string, boolean> => {
    const typedCharacter = typedCharacters.value[index]

    return {
      'is-correct': typedCharacter === character,
      'is-error': typedCharacter !== undefined && typedCharacter !== character,
      'is-current': isChallengeActive.value && index === typedCharacters.value.length,
    }
  }

  const isKeyPressed = (key: string): boolean => pressedKey.value === key
  const isNextKey = (key: string): boolean => {
    if (!isKeyHintEnabled.value || !isChallengeActive.value) {
      return false
    }

    if (key === 'Shift') {
      return shouldHintShift.value
    }

    return getKeyboardBaseKey(nextKey.value) === key
  }
  // -------------------- Lifecycle --------------------
  onBeforeUnmount(() => {
    cancelTimer()

    if (pressedKeyTimeout) {
      clearTimeout(pressedKeyTimeout)
    }
  })

  return {
    captureInputRef,
    status,
    difficulty,
    difficultyLabel,
    promptCharacters,
    isChallengeActive,
    isKeyHintEnabled,
    currentWpm,
    accuracy,
    progress,
    buttonLabel,
    isTimerRunning,
    timerStateLabel,
    statusMessage,
    formattedElapsed,
    formattedLimit,
    keyboardRows: TYPING_KEYBOARD_ROWS,
    fingerGuide: TYPING_FINGER_GUIDE,
    difficultyOptions: TYPING_DIFFICULTIES,
    averageWpm,
    bestWpm,
    attemptCount,
    startChallenge,
    selectDifficulty,
    toggleKeyHint,
    handleKeydown,
    handleBeforeInput,
    clearCaptureInput,
    focusCaptureInput,
    getCharacterClasses,
    isKeyPressed,
    isNextKey,
  }
}
