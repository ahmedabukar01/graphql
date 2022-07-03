const express = require('express');
const {graphqlHTTP} = require('express-graphql')
const {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt} = require('graphql')

const app = express();

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'this represents a book',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (parent) => {
                return authors.find(author=> author.id === parent.authorId)
            }
        }
    })
})

// Author Type
const AuthorType = new GraphQLObjectType({
    name: 'authorType',
    description: 'Author Type',
    fields: ()=> ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books:{
            type:  GraphQLList(BookType),
            resolve: (author) =>{
                return books.filter(book=> book.authorId === author.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Query Type',
    fields: ()=> ({
        books: {
            type: GraphQLList(BookType),
            description: 'list of all books',
            resolve: ()=> books
        },
        book: {
            type: BookType,
            description: 'Single Book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args)=> books.find(book => book.id === args.id)
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: "list of all Authors",
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: "Single Author",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => authors.find(author => author.id === args.id)
        }
    })
})

// mutation 
const MutionType = new GraphQLObjectType({
    name: "mutations",
    description: "add new Book",
    feilds: () => ({
        addBooks: {
            type: BookType,
            description: "add new Book",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent,args) =>{
                const book = {id: books.length +1, name: args.name, authorId: args.authorId}
                books.push(book)
            
            }
        },
        addAuthor: {
            type: AuthorType,
            description: "add new Book",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent,args) =>{
                const author = {id: authors.length +1, name: args.name}
                authors.push(author)
            
            }
        }
    })
})

// schema
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: MutionType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(5000, ()=>{
    console.log('server is running ...')
})


// startin devwork Contribution...
