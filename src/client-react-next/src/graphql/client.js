import { ApolloClient, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import appConfig from '../appConfig'
import { createUploadLink } from 'apollo-upload-client'
import storageService from '../services/storageService'
import cache from '../graphql/cache'
import { runEvent } from '../services/serviceHub'

export function createClient(ssr = false) {
    let targetURL = ssr ? appConfig.baseUrlDocker : appConfig.baseUrl
    let newURL = `${targetURL}/graphql`

    const uploadLink = createUploadLink({
        uri: newURL,
    })

    const logoutLink = onError(({ networkError }) => {
        if(networkError && networkError.statusCode === 401) {
            runEvent('logout');
        }
    })

    const authLink = setContext((_, { headers }) => {
        if(!ssr) {
            let token = storageService.getToken();
    
            if(token) {
                return {
                    headers: {
                        ...headers,
                        ['x-access-token']: token,
                    }
                }
            }
        }
    
        return {
            headers
        }
    });

    return new ApolloClient({
        link: ApolloLink.from([authLink, logoutLink, uploadLink]),
        cache,
    })
}
