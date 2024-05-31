const express = require('express');
const { buildSchema } = require('graphql');
// const { query } = require('graphql-express')
const { createHandler } = require("graphql-http/lib/use/express")

const { ruruHTML } = require("ruru/server")

const schema = buildSchema(` 

type Query {
   products: [Product]
   orders: [Order]
}

type Product {
    id: ID!
    description: String!
    reviews: [Review]
    price: Float!
}

type Review {
    rating: Int!
    comment: String
}

type Order {
    date: String!
    subtotal: Float!
    items: [OrderItem]
}

type OrderItem {
    product: Product!
    quantity: Int!
}
`);

const root = {
    products: [
        {
            id: 'redshoe',
            description: 'Red Shoe',
            price: 42.12,
        },
        {
            id: 'bluejean',
            description: 'Blue Jean',
            price: 55.55,
        }
    ],
    orders: [
        {
            date: '2020-01-01',
            subtotal: 150.23,
            items: [
                {
                    product: {
                        id: 'redshoe',
                        description: 'Red Shoe',
                        price: 42.12,
                    },
                    quantity: 2,
                }
            ]
        }
    ]
}
const app = express();

app.use('/graphql', createHandler({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

// Serve the GraphiQL IDE.
app.get("/graphqli", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
  })

app.listen(3000, () => {
    console.log('Server GraphQL running on port 3000');
})