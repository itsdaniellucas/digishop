import { gql } from '@apollo/client'

const GET_PRODUCTS = gql`
    query getProducts($pagination: Pagination!) {
        products(pagination: $pagination) {
            Data {
                id
                name
                image
                description
                quantity
                price
            }
            TotalPages
            Error
            IsSuccessful
        }
    }
`

const GET_PRODUCT = gql`
    query getProduct($id: ID!) {
        product(id: $id) {
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

const GET_ORDERS = gql`
    query getOrders($pagination: Pagination!) {
        orders(pagination: $pagination) {
            Data {
                id
                user {
                    id
                    username
                }
                products {
                    id
                    productId
                    name
                    image
                    quantity
                    price
                }
                dateCreated
            }
            TotalPages
            Error
            IsSuccessful
        }
    }
`

const GET_ORDER = gql`
    query getOrder($id: ID!) {
        order(id: $id) {
            Data {
                id
                user {
                    id
                    username
                }
                products {
                    id
                    productId
                    name
                    image
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

const GET_CART = gql`
    query getCart {
        cart {
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


export { 
    GET_PRODUCTS, 
    GET_PRODUCT, 
    GET_ORDER, 
    GET_ORDERS, 
    GET_CART
}