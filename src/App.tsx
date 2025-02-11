import { ComponentProps, forwardRef, useState } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { CaretDown, GithubLogo } from '@phosphor-icons/react'
import clsx from 'clsx'

import './globals.css'

import { UNameInput } from './components/uname-input.tsx'
import { DomainInput } from './components/domain-input.tsx'
import { AutoSubmitSwitch } from './components/auto-submit-switch.tsx'
import { UNameSelectorInput } from './components/uname-selector-input.tsx'
import { DomainSelectorInput } from './components/domain-selector-input.tsx'
import { SubmitSelectorInput } from './components/submit-selector-input.tsx'
import { Logo } from './components/logo.tsx'

function App() {
  const [shouldRun, setShouldRun] = useState<boolean>(true)

  try {
    chrome.storage.local.get(['shouldRun'], (result) => {
      setShouldRun(result.shouldRun)
    })
  } catch {
    console.error('Nope.')
  }

  return (
    <div className="relative flex h-[586px] w-[400px] flex-col gap-4 overflow-hidden bg-zinc-900 p-4 text-white">
      <div className="flex flex-none items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="inline-block h-fit pb-px text-white/70">
              Auto-login
            </span>
          </div>
          <a
            href={'https://github.com/milovangudelj'}
            target="_blank"
            className="inline-flex items-center gap-2 text-xs font-medium opacity-40 transition hover:opacity-100"
          >
            by @milovangudelj{' '}
            <span>
              <GithubLogo
                aria-hidden={true}
                className="h-4 w-4"
                weight="bold"
              />
            </span>
          </a>
        </div>
        {shouldRun ? (
          <span className="mb-6 inline-flex h-fit items-center gap-1 rounded bg-green-500/10 px-1 text-green-500">
            Attivo
          </span>
        ) : (
          <span className="mb-6 inline-flex h-fit items-center gap-1 rounded bg-amber-500/10 px-1 text-amber-500">
            Disattivato
          </span>
        )}
      </div>
      <span className="block h-px bg-white/10"></span>
      <div className="flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto">
        <AutoSubmitSwitch />
        <DomainInput />
        <UNameInput />
        <Accordion.Root type="single" collapsible>
          <Accordion.Item
            value="impostazioni-avanzate"
            className="flex flex-col gap-2"
          >
            <AccordionTrigger>
              <span>Impostazioni avanzate</span>
            </AccordionTrigger>
            <AccordionContent>
              <DomainSelectorInput />
              <UNameSelectorInput />
              <SubmitSelectorInput />
            </AccordionContent>
          </Accordion.Item>
        </Accordion.Root>
      </div>
      <span className="block h-px bg-white/10"></span>
      <button
        className={clsx(
          'flex-none cursor-pointer rounded-lg px-4 py-2 font-bold transition',
          {
            'bg-red-600 hover:bg-red-700': shouldRun,
            'bg-blue-600 hover:bg-blue-700': !shouldRun,
          }
        )}
        onClick={() => {
          try {
            chrome.storage.local
              .set({ shouldRun: !shouldRun })
              .then(() => {
                setShouldRun(!shouldRun)
              })
              .catch(console.error)
          } catch {
            setShouldRun(!shouldRun)
          }
        }}
      >
        {shouldRun ? 'Disattiva' : 'Attiva'}
      </button>
    </div>
  )
}

const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  ComponentProps<'button'>
>(({ children, ...props }, forwardedRef) => (
  <Accordion.Header>
    <Accordion.Trigger
      className="group flex min-h-[42px] w-full cursor-pointer items-center gap-2 text-white/70 data-[state=open]:text-white"
      {...props}
      ref={forwardedRef}
    >
      <div className="flex items-center gap-1 text-sm transition">
        {children}
      </div>
      <span className="inline-block h-px flex-1 bg-white/10"></span>
      <CaretDown
        aria-hidden
        className="transition-transform group-data-[state=open]:rotate-180"
      />
    </Accordion.Trigger>
  </Accordion.Header>
))

const AccordionContent = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ children, ...props }, forwardedRef) => (
    <Accordion.Content
      className="data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden transition-transform"
      {...props}
      ref={forwardedRef}
    >
      <div className="flex flex-col gap-2">{children}</div>
    </Accordion.Content>
  )
)

export default App
