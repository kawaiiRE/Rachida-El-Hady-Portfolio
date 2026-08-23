<template>
  <section id="typing" class="typing-challenge">
    <div class="app-container section-content">
      <header class="header" data-motion>
        <div>
          <p class="section-label">A quick break</p>
          <h2 class="section-title">{{ heading }}</h2>
        </div>
        <p>
          A tiny typing sprint made from details across this portfolio. Follow the finger colors,
          chase your best, and give the keyboard something to glow about.
        </p>
      </header>

      <div class="game" data-motion @click.self="focusCaptureInput">
        <div class="scoreboard" aria-label="Typing challenge statistics">
          <div class="stat timer">
            <span>Time</span>
            <strong>{{ formattedElapsed }}</strong>
            <small>Limit {{ formattedLimit }}</small>
          </div>
          <div class="stat">
            <span>Current</span>
            <strong>{{ currentWpm }}</strong>
            <small>WPM</small>
          </div>
          <div class="stat">
            <span>{{ difficultyLabel }} avg</span>
            <strong>{{ attemptCount ? averageWpm : '—' }}</strong>
            <small>{{ attemptCount ? 'WPM' : 'No runs yet' }}</small>
          </div>
          <div class="stat">
            <span>Best</span>
            <strong>{{ attemptCount ? bestWpm : '—' }}</strong>
            <small>{{ attemptCount ? 'WPM' : 'This visit' }}</small>
          </div>
        </div>

        <div class="challenge">
          <div class="settings">
            <div class="level-picker" aria-label="Challenge difficulty">
              <span>Level</span>
              <div class="level-options">
                <button
                  v-for="option in difficultyOptions"
                  :key="option.id"
                  type="button"
                  class="level-button"
                  :class="{ 'is-active': difficulty === option.id }"
                  :disabled="isChallengeActive"
                  :aria-pressed="difficulty === option.id"
                  :title="option.description"
                  @click="selectDifficulty(option.id)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <button
              type="button"
              class="hint-button"
              :class="{ 'is-active': isKeyHintEnabled }"
              :aria-pressed="isKeyHintEnabled"
              @click="toggleKeyHint"
            >
              <span class="hint-light" aria-hidden="true"></span>
              Key hint {{ isKeyHintEnabled ? 'on' : 'off' }}
            </button>
          </div>

          <div class="controls">
            <button type="button" class="start-button" @click="startChallenge">
              <span>{{ buttonLabel }}</span>
              <span aria-hidden="true">↗</span>
            </button>
            <div
              class="live-clock"
              :class="{ 'is-running': isTimerRunning }"
              role="timer"
              :aria-label="`${timerStateLabel}: ${formattedElapsed}`"
            >
              <i aria-hidden="true"></i>
              <strong>{{ formattedElapsed }}</strong>
            </div>
            <p class="status" role="status" aria-live="polite">{{ statusMessage }}</p>
          </div>

          <div
            class="prompt"
            :class="{
              'is-locked': status === 'idle',
              'is-finished': status === 'completed' || status === 'timeout',
              'is-timeout': status === 'timeout',
            }"
            @click="focusCaptureInput"
          >
            <p class="prompt-label">
              <span>{{
                status === 'idle' ? `Locked ${difficultyLabel} prompt` : difficultyLabel
              }}</span>
              <span v-if="status !== 'idle'">Accuracy {{ accuracy }}%</span>
            </p>
            <p class="prompt-copy" :aria-hidden="status === 'idle'">
              <span
                v-for="(character, index) in promptCharacters"
                :key="`${character}-${index}`"
                :class="getCharacterClasses(character, index)"
                >{{ character }}</span
              >
            </p>
            <span class="progress-track" aria-hidden="true">
              <span :style="{ transform: `scaleX(${progress / 100})` }"></span>
            </span>
          </div>

          <input
            ref="captureInputRef"
            class="capture-input"
            type="text"
            inputmode="text"
            autocomplete="off"
            autocapitalize="none"
            autocorrect="off"
            spellcheck="false"
            enterkeyhint="done"
            data-gramm="false"
            tabindex="-1"
            aria-label="Type the challenge prompt"
            @keydown="handleKeydown"
            @beforeinput="handleBeforeInput"
            @input="clearCaptureInput"
            @paste.prevent
          />
        </div>

        <div class="keyboard-wrap">
          <div
            class="keyboard"
            role="img"
            aria-label="Touch typing keyboard visualizer. Keys light up when typed."
          >
            <div v-for="(row, rowIndex) in keyboardRows" :key="rowIndex" class="key-row">
              <span
                v-for="(key, keyIndex) in row"
                :key="`${key.value}-${keyIndex}`"
                class="key"
                :class="[
                  `finger-${key.finger}`,
                  key.size ? `size-${key.size}` : '',
                  {
                    'is-pressed': isKeyPressed(key.value),
                    'is-next': isNextKey(key.value),
                  },
                ]"
                aria-hidden="true"
              >
                <span v-if="key.secondaryLabel" class="secondary">{{ key.secondaryLabel }}</span>
                <span>{{ key.label }}</span>
              </span>
            </div>
          </div>

          <ul class="finger-guide" aria-label="Touch typing finger color guide">
            <li v-for="guide in fingerGuide" :key="guide.finger" :class="`finger-${guide.finger}`">
              <span aria-hidden="true"></span>{{ guide.label }}
            </li>
          </ul>
        </div>

        <footer class="game-footer">
          <span>Physical keys light up as you type</span>
          <span>Backspace works</span>
          <span>{{ difficultyLabel }} stats reset on refresh</span>
        </footer>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
