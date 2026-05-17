export const themeColorVariables = {
  gray950: '--gray-scale-950',
  gray900: '--gray-scale-900',
  gray800: '--gray-scale-800',
  gray700: '--gray-scale-700',
  gray50: '--gray-scale-50',
  primary400: '--primary-scale-400',
  secondary400: '--secondary-scale-400',
} as const

export const resolveCssVarColor = (cssVariableName: string): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  return getComputedStyle(document.documentElement).getPropertyValue(cssVariableName).trim()
}

export const hexColorToNumber = (hexColor: string): number => {
  const normalizedHexColor = hexColor.replace('#', '').trim()

  if (normalizedHexColor.length === 3) {
    const expandedHexColor = normalizedHexColor
      .split('')
      .map((character) => `${character}${character}`)
      .join('')

    return Number.parseInt(expandedHexColor, 16)
  }

  if (normalizedHexColor.length === 6) {
    return Number.parseInt(normalizedHexColor, 16)
  }

  return 0
}
