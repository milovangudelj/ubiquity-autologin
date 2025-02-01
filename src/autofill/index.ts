function setNativeValue(element: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(element),
    'value'
  )
  const setter = descriptor?.set
  setter?.call(element, value)
  element.dispatchEvent(new Event('input', { bubbles: true }))
}

async function fillInputsAndLogin() {
  const {
    shouldRun,
    username,
    domain,
    autoSubmit,
    unameSelector,
    domainSelector,
    submitSelector,
  } = await chrome.storage.local.get([
    'shouldRun',
    'username',
    'domain',
    'autoSubmit',
    'unameSelector',
    'domainSelector',
    'submitSelector',
  ])

  if (!shouldRun) {
    return
  }

  const uname_input = document.querySelector<HTMLInputElement>(
    unameSelector ?? `input#tfield-loginFormUsername`
  )
  const domain_input = document.querySelector<HTMLInputElement>(
    domainSelector ?? `input#tfield-loginFormDomain`
  )
  const submit_button = document.querySelector<HTMLButtonElement>(
    submitSelector ?? `button#btn-loginFormNext`
  )

  if (!uname_input || !domain_input || !submit_button) {
    console.error('Failed to find inputs')
    return
  }

  const observer = new MutationObserver(() => {
    if (!submit_button.hasAttribute('disabled')) {
      observer.disconnect()
      submit_button.click()
    }
  })

  uname_input.dispatchEvent(new Event('focus', { bubbles: true }))
  setNativeValue(uname_input, username)
  uname_input.dispatchEvent(new Event('blur', { bubbles: true }))

  domain_input.dispatchEvent(new Event('focus', { bubbles: true }))
  setNativeValue(domain_input, domain)
  domain_input.dispatchEvent(new Event('blur', { bubbles: true }))

  if (autoSubmit && username && domain) {
    if (!submit_button.hasAttribute('disabled')) {
      submit_button.click()
      return
    }
    
    observer.observe(submit_button, {
      attributes: true,
      attributeFilter: ['disabled'],
    })
  }
}

fillInputsAndLogin().catch(console.error)
