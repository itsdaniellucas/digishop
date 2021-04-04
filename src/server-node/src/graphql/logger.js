const winston = require('../winstonConfig')

const loggerPlugin = {
    requestDidStart: (reqCtx) => {
        const date = new Date().toISOString();
        const user = (reqCtx.context.user || { username: '-'}).username;
        const id = reqCtx.context.reqId;
        const query = reqCtx.request.query;
        
        if(!query.includes('IntrospectionQuery')) {
            winston.info(`${date} ${id} ${user} Request started: ${query}`);
        }
        

        const didEncounterErrors = (ctx) => {
            if(!query.includes('IntrospectionQuery')) {
                winston.info(`${date} ${id} ${user} Errors: ${ctx.errors}`);
            }
        }

        const willSendResponse = () => {
            if(!query.includes('IntrospectionQuery')) {
                winston.info(`${date} ${id} ${user} Request ended.`);
            }
        }

        return {
            didEncounterErrors,
            willSendResponse
        }
    }
}

module.exports = loggerPlugin