const express = require('express');
const {graphqlHTTP} = require('express-graphql')
const {GraphQLObjectType, GraphQLSchema, GraphQLString} = require('graphql')

const app = express();

const Schema = new GraphQLSchema({
    query: GraphQLObjectType({
        name: 'hello world',
        fields: () => ({
            message: {type: GraphQLString}
        })
    })
})

app.use('/graphql', graphqlHTTP({
    graphiql: true
}))

app.listen(5000, ()=>{
    console.log('server is running ...')
})