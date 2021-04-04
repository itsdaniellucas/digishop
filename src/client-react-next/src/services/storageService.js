

const keys = {
    token: 'token',
    userData: 'userData',
    expiration: 'expiration',
}

function getLocalStorageItem(key, isParsed) {
    let result = window.localStorage.getItem(key);
    if(isParsed) {
        result = JSON.parse(result);
    }
    return result;
}

function setLocalStorageItem(key, value, isStringified) {
    if(value) {
        if(isStringified) {
            value = JSON.stringify(value);
        }
        window.localStorage.setItem(key, value);
    } else {
        window.localStorage.removeItem(key);
    }
}

function getToken() {
    return getLocalStorageItem(keys.token);
}

function getTokenExpiration() {
    return getLocalStorageItem(keys.expiration);
}

function getUser() {
    return getLocalStorageItem(keys.userData, true);
}

function setToken(token) {
    setLocalStorageItem(keys.token, token)
}

function setTokenExpiration(expiration) {
    setLocalStorageItem(keys.expiration, expiration);
}

function setUser(user) {
    setLocalStorageItem(keys.userData, user, true);
}


const storageService = {
    getToken: getToken,
    getTokenExpiration: getTokenExpiration,
    getUser: getUser,
    setToken: setToken,
    setTokenExpiration: setTokenExpiration,
    setUser: setUser,
}

export default storageService