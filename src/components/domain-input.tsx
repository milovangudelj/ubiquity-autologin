import { Drawer } from 'vaul'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

type FormData = {
  domain: string
}

const getDomain = async () => {
  try {
    return (await chrome.storage.local.get(['domain']))['domain'] as string
  } catch {
    return ''
  }
}

export function DomainInput() {
  const [open, setOpen] = useState(false)
  const [domain, setDomain] = useState<string>()
  const { register, handleSubmit, setValue } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    try {
      chrome.storage.local.set({ domain: data.domain }).then(() => {
        setDomain(data.domain)
        setOpen(false)
      })
    } catch {
      setDomain(data.domain)
      setOpen(false)
    }
  })

  useEffect(() => {
    getDomain().then((value) => {
      setDomain(value)
      setValue('domain', value)
    })
  }, [setValue])

  return (
    <div className="flex min-h-[42px] items-center justify-between">
      <span className="leading-none select-none">Domain</span>
      <Drawer.Root
        handleOnly={true}
        open={open}
        onOpenChange={(hasOpened) => {
          if (hasOpened) setValue('domain', domain || '')
          setOpen(hasOpened)
        }}
      >
        <Drawer.Trigger
          className={
            'max-w-52 flex-1 cursor-text rounded border border-white/10 bg-transparent p-2 text-left placeholder-white/40 transition focus-within:border-white/20 focus-within:bg-white/2 focus-within:ring-3 focus-within:ring-white/[0.06] focus-within:outline-none hover:border-white/20'
          }
        >
          <span
            className={clsx({
              'text-white/40': !domain,
              'text-white': domain,
            })}
          >
            {domain || 'aziendaxyz'}
          </span>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            aria-describedby={undefined}
            className="fixed bottom-0 mx-auto h-fit w-[400px] overflow-hidden rounded-t-lg bg-zinc-900 outline-none"
          >
            <div className="bg-zinc-800 p-4">
              <form className="flex flex-col gap-8" onSubmit={onSubmit}>
                <div className="flex min-h-[42px] flex-col gap-2">
                  <label className="leading-none select-none" htmlFor="domain">
                    <Drawer.Title>Domain</Drawer.Title>
                  </label>
                  <input
                    {...register('domain')}
                    autoFocus={true}
                    id="domain"
                    type="text"
                    placeholder="aziendaxyz"
                    className="flex-1 cursor-text rounded border border-white/10 bg-transparent p-2 text-left placeholder-white/40 transition focus-within:border-white/20 focus-within:bg-white/2 focus-within:ring-3 focus-within:ring-white/[0.06] focus-within:outline-none hover:border-white/20"
                  />
                </div>
                <button className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-bold transition focus-within:ring-3 focus-within:ring-blue-900 focus-within:outline-none hover:bg-blue-700">
                  Salva
                </button>
              </form>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}
