
const appConfig = Object.freeze({
    baseUrl: 'http://localhost:13002',
    baseUrlDocker: 'http://ds_web:13002',
    itemsPerPage: 15,
    isSSR: () => global.window
});


export default appConfig
