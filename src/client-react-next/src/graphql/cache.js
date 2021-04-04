import { makeVar, InMemoryCache } from '@apollo/client'

export const user = makeVar(null)
export const alert = makeVar({
    visible: false,
    isProgress: true,
    text: 'Saving changes made...',
    severity: 'info',
    timeout: 5000,
    timeoutFn: null,
    type: 'saving',
})
export const fetching = makeVar(false)

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                user: {
                    read() {
                        return user();
                    }
                },
                alert: {
                    read() {
                        return alert();
                    }
                },
                fetching: {
                    read() {
                        return fetching();
                    }
                }
            }
        }
    }
})

export default cache


export function alertSaving(text = '', autoFade = false) {
    const currentConfig = alert();

    if(currentConfig.timeoutFn) {
        clearTimeout(currentConfig.timeoutFn)
    }

    const newConfig = {
        type: 'saving',
        visible: true,
        isProgress: true,
        text: text || 'Saving changes made...',
        severity: 'info',
        timeout: 5000,
    }

    if(autoFade) {
        newConfig.timeoutFn = setTimeout(() => {
            alert({
                ...alert(),
                visible: false
            })
        }, newConfig.timeout)
    }

    alert({
        ...newConfig
    })
}

export function alertSuccess(text = '', autoFade = true) {
    const currentConfig = alert();

    if(currentConfig.timeoutFn) {
        clearTimeout(currentConfig.timeoutFn)
    }

    const newConfig = {
        type: 'success',
        visible: true,
        isProgress: false,
        text: text || 'Changes have been saved!',
        severity: 'success',
        timeout: 5000,
    }

    if(autoFade) {
        newConfig.timeoutFn = setTimeout(() => {
            alert({
                ...alert(),
                visible: false
            })
        }, newConfig.timeout)
    }

    alert({
        ...newConfig
    })
}

export function alertError(text = '', autoFade = true) {
    const currentConfig = alert();

    if(currentConfig.timeoutFn) {
        clearTimeout(currentConfig.timeoutFn)
    }

    const newConfig = {
        type: 'error',
        visible: true,
        isProgress: false,
        text: text || 'An error occured while saving!',
        severity: 'error',
        timeout: 5000,
    }

    if(autoFade) {
        newConfig.timeoutFn = setTimeout(() => {
            alert({
                ...alert(),
                visible: false
            })
        }, newConfig.timeout)
    }

    alert({
        ...newConfig
    })
}