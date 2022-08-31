const express = require('express');
const {ApolloServer} = require('apollo-sever-express');
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
})

//integration
server.applyMiddlewear({app});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

  app.get('*', (req, res)=> {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));

  //GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);

});

process.on('uncaughtException', function(err){
  console.log('caught exception: ' + err);
})

