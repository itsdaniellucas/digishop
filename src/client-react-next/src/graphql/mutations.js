import { gql } from '@apollo/client'
import { alertSaving, alertSuccess, alertError } from '../graphql/cache'

const ADD_PRODUCT = gql`
    mutation addProduct($product: NewProduct!) {
        addProduct(product: $product) {
            Data {
                id
                name
                image
                description
                quantity
                price
            }
            Error
            IsSuccessful
        }
    }
`

const REMOVE_PRODUCT = gql`
    mutation removeProduct($id: ID!) {
        removeProduct(id: $id) {
            Data {
                id
                name
                image
                description
                quantity
                price
            }
            Error
            IsSuccessful
        }
    }
`

const MODIFY_PRODUCT = gql`
    mutation modifyProduct($id: ID!, $product: ModifyProduct!) {
        modifyProduct(id: $id, product: $product) {
            Data {
                id
                name
                image
                description
                quantity
                price
            }
            Error
            IsSuccessful
        }
    }
`

const ADD_STOCK = gql`
    mutation addStock($id: ID!, $quantity: Int!) {
        addStock(id: $id, quantity: $quantity) {
            Data {
                id
                name
                image
                description
                quantity
                price
            }
            Error
            IsSuccessful
        }
    }
`

const ADD_ORDER = gql`
    mutation addOrder($order: NewOrder!) {
        addOrder(order: $order) {
            Data {
                id
                user {
                    id
                    username
                    role
                }
                products {
                    id
                    name
                    quantity
                    price
                }
                dateCreated
            }
            Error
            IsSuccessful
        }
    }
`

const REMOVE_ORDER = gql`
    mutation removeOrder($id: ID!) {
        removeOrder(id: $id) {
            Data {
                id
                user {
                    id
                    username
                    role
                }
                products {
                    id
                    name
                    quantity
                    price
                }
                dateCreated
            }
            Error
            IsSuccessful
        }
    }
`

const ADD_TO_CART = gql`
    mutation addToCart($product: CartProductInput!) {
        addToCart(product: $product) {
            Data {
                id
                name
                quantity
                price
            }
            Error
            IsSuccessful
        }
    }
`

const REMOVE_FROM_CART = gql`
    mutation removeFromCart($productId: ID!) {
        removeFromCart(productId: $productId) {
            Data {
                id
                name
                quantity
                price
            }
            Error
            IsSuccessful
        }
    }
`

const ADD_QUANTITY = gql`
    mutation addQuantity($productId: ID!, $quantity: Int!) {
        addQuantity(productId: $productId, quantity: $quantity) {
            Data {
                id
                name
                quantity
                price
            }
            Error
            IsSuccessful
        }
    }
`

const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            Data {
                User {
                    id
                    username
                    role
                }
                Token
                TokenExpiration
            }
            Error
            IsSuccessful
        }
    }
`



function mutationWrapper({ mutation, operationName, action, savingMsg, successMsg, errorMsg }) {
    alertSaving(savingMsg)
    return mutation.then(result => {
        let response = result.data[operationName]
        
        if(response.Error) {
            alertError(errorMsg || response.Error)
        } else {
            alertSuccess(successMsg)
        }

        if(action) {
            action()
        }
    })
}

export { 
    ADD_PRODUCT, 
    REMOVE_PRODUCT,
    MODIFY_PRODUCT, 
    ADD_STOCK,
    ADD_ORDER,
    REMOVE_ORDER,
    ADD_TO_CART,
    REMOVE_FROM_CART,
    ADD_QUANTITY,
    LOGIN,
    mutationWrapper,
}