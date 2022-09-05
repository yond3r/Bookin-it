const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const {authMiddleware} = require('./utils/auth');

const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const {typeDefs, resolvers} = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

//apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

//integration
// await server.start(); -- why won't you let me call this if you're telling me there is an error prior aaa
server.start().then(res =>{
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

  app.get('*', (req, res)=> {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    // console.log(`API server running on port ${PORT}`)
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
});

process.on('uncaughtException', function(err){
  console.log('caught exception: ' + err);
});

