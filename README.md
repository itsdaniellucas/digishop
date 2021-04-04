# Portfolio Project #4: DigiShop

## Description

DigiShop is a shopping web application with CRUD for products (admin) and orders (users) which uses GraphQL and server-side rendering via NextJS.

>Disclaimer: The purpose of these projects is to showcase my knowledge of technologies, libraries and concepts in a simple application, it is expected to be a small-scaled application, the focus should be on the use cases of said technologies, libraries and concepts.

## Technologies and Libraries

The following technologies/libraries/concepts were used:

Server:

* Language - [`Javascript (Node)`](https://nodejs.org/en/)
* Framework - [`Express`](https://expressjs.com/)
* [`GraphQL`](https://graphql.org/) - [`Apollo Server`](https://www.apollographql.com/docs/apollo-server/)
* CORS
* Database - [`MongoDB`](https://www.mongodb.com/)
* ODM - [`Mongoose`](https://mongoosejs.com/)
* Authentication - [`JWT`](https://jwt.io/)
* Logging - [`winston`](https://www.npmjs.com/package/winston)
* Containerization - [`Docker`](https://www.docker.com/)

Client:

* SPA Framework/Library - [`React`](https://reactjs.org/) (Hooks)
* UI Library - [`Material-UI`](https://material-ui.com/) (React)
* [`GraphQL`](https://graphql.org/) - [`Apollo Client`](https://www.apollographql.com/docs/react/)
* SSR - [`Next.js`](https://nextjs.org/)
* Containerization - [`Docker`](https://www.docker.com/)


## Running the Project

You need to install the following:

* [Node and NPM](https://nodejs.org/en/download/)
* [MongoDB](https://www.mongodb.com/try/download/community)
* [Docker Desktop](https://www.docker.com/products/docker-desktop)


Clone Repo:
```
> git clone https://github.com/itsdaniellucas/digishop

or using GitHub CLI
> gh repo clone itsdaniellucas/digishop
```

Run everything via Docker:

Before anything, you need to launch `Docker Desktop` first, and modify `docker-compose.yml` file, under the `volumes` segments of `digishop/ds_web` and `ds_db` services you need to point it to your host directory, then you can run the following

```
> cd digishop\src\server-node
> docker-compose build
> docker-compose up
```

Endpoint:
```
React (Next)
http://localhost:13001
```

Default Users:
|   Username    |   Password    |   Description                                                                                 |
|---------------|---------------|-----------------------------------------------------------------------------------------------|
|   user        |   user        |   View products, create and delete orders                                                     |
|   admin       |   admin       |   Create/modify/delete products, create and delete orders                                     |
|   (anonymous) |   (anonymous) |   View products                                                                               |

## License

MIT