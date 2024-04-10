import React from 'react'
import JsonView from '@uiw/react-json-view'
import { useSelector } from 'react-redux'
import { useMediaPredicate } from 'react-media-hook'
import translator from 'src/data/translator.json'
const githubLightTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#6f42c1',
  '--w-rjv-key-string': '#6f42c1',
  '--w-rjv-background-color': '#ffffff',
  '--w-rjv-line-color': '#ddd',
  '--w-rjv-arrow-color': '#6e7781',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#0000004d',
  '--w-rjv-update-color': '#ebcb8b',
  '--w-rjv-copied-color': '#002b36',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#6a737d',
  '--w-rjv-colon-color': '#24292e',
  '--w-rjv-brackets-color': '#6a737d',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#032f62',
  '--w-rjv-type-int-color': '#005cc5',
  '--w-rjv-type-float-color': '#005cc5',
  '--w-rjv-type-bigint-color': '#005cc5',
  '--w-rjv-type-boolean-color': '#d73a49',
  '--w-rjv-type-date-color': '#005cc5',
  '--w-rjv-type-url-color': '#0969da',
  '--w-rjv-type-null-color': '#d73a49',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#005cc5',
}

export const githubDarkTheme = {
  '--w-rjv-font-family': 'monospace',
  '--w-rjv-color': '#79c0ff',
  '--w-rjv-key-string': '#79c0ff',
  '--w-rjv-background-color': '#0d1117',
  '--w-rjv-line-color': '#94949480',
  '--w-rjv-arrow-color': '#ccc',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#7b7b7b',
  '--w-rjv-update-color': '#ebcb8b',
  '--w-rjv-copied-color': '#79c0ff',
  '--w-rjv-copied-success-color': '#28a745',

  '--w-rjv-curlybraces-color': '#8b949e',
  '--w-rjv-colon-color': '#c9d1d9',
  '--w-rjv-brackets-color': '#8b949e',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',

  '--w-rjv-type-string-color': '#a5d6ff',
  '--w-rjv-type-int-color': '#79c0ff',
  '--w-rjv-type-float-color': '#79c0ff',
  '--w-rjv-type-bigint-color': '#79c0ff',
  '--w-rjv-type-boolean-color': '#ffab70',
  '--w-rjv-type-date-color': '#79c0ff',
  '--w-rjv-type-url-color': '#4facff',
  '--w-rjv-type-null-color': '#ff7b72',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#79c0ff',
}
const matchPattern = (key, patterns) => {
  return patterns.some((pattern) => {
    if (pattern.includes('*')) {
      // Replace * with regex that matches any character sequence and create a RegExp object
      const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`, 'i')
      return regex.test(key)
    }
    return pattern.toLowerCase() === key.toLowerCase()
  })
}

const translateAndRemoveKeys = (obj, removePatterns = []) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => translateAndRemoveKeys(item, removePatterns))
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      // Check if the key matches any removal pattern
      if (!matchPattern(key, removePatterns)) {
        const translatedKey =
          translator[key.toLowerCase()] ||
          key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
        acc[translatedKey] = translateAndRemoveKeys(value, removePatterns) // Recursively process
      }
      return acc
    }, {})
  }
  return obj
}

function CippJsonView({ object, removeKeys = ['*@odata*'] }) {
  const currentTheme = useSelector((state) => state.app.currentTheme)
  const preferredTheme = useMediaPredicate('(prefers-color-scheme: dark)') ? 'impact' : 'cyberdrain'
  const theme =
    currentTheme === 'impact' || (currentTheme === preferredTheme) === 'impact'
      ? githubDarkTheme
      : githubLightTheme
  const translatedObject = translateAndRemoveKeys(object, removeKeys)
  console.log('translatedObject', translatedObject)

  return (
    <JsonView
      value={translatedObject}
      collapsed={1}
      displayDataTypes={false}
      displayObjectSize={false}
      style={{ ...theme }}
    />
  )
}

export default CippJsonView