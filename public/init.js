;(async () => {
    const src = chrome?.runtime?.getURL('/autofill/index.js')
    await import(src)
})()