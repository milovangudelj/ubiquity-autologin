import { useEffect, useState } from 'react'
import * as Switch from '@radix-ui/react-switch'

const getAutoSubmit = async () => {
  try {
    return (await chrome.storage.local.get(['autoSubmit']))[
      'autoSubmit'
    ] as boolean
  } catch {
    return false
  }
}

export function AutoSubmitSwitch() {
  const [autoSubmit, setAutoSubmit] = useState<boolean>()

  useEffect(() => {
    getAutoSubmit().then((value) => {
      setAutoSubmit(value)
    })
  }, [])

  useEffect(() => {
    try {
      chrome.storage.local.set({ autoSubmit: autoSubmit }, () => {})
    } catch {
      console.error('Nope.')
    }
  }, [autoSubmit])

  return (
    <div className="flex min-h-[42px] items-center justify-between">
      <label className="leading-none select-none" htmlFor="auto-submit">
        Auto-submit
      </label>
      <Switch.Root
        id="auto-submit"
        checked={autoSubmit}
        onCheckedChange={setAutoSubmit}
        className="relative h-6 w-[42px] rounded-full bg-zinc-700 shadow-md transition [-webkit-tap-highlight-color:transparent] data-[state=checked]:bg-blue-600"
      >
        <Switch.Thumb className="block aspect-square w-5 translate-x-0.5 rounded-full bg-zinc-500 shadow transition-transform will-change-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-white" />
      </Switch.Root>
    </div>
  )
}
