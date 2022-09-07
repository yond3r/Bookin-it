const {user, Book, User} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {

            if(context.user){
                const userData = await User.findOne({})
                    .select('-__v -password')
                    .populate('books')

                    return userData
            }

            throw new AuthenticationError('you are not logged in!!')
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },

        login: async (parent, {email, password}) =>{
            console.log(email, password);
            const user = await User.findOne({email});
                console.log(user);
            if(!user) {
                throw new AuthenticationError('Incorrect credentials, try again');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw){
                throw new AuthenticationError('Incorrect credentials, try again')
            }

            const token = signToken(user);
                console.log(token);
            return {token, user};
        },

        saveBook: async (parent, args, context) => {
            if (context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: args.bookId}}},
                    {new: true}
                );
                return updatedUser;
                }

                throw new AuthenticationError('You must be logged in, please try again');
        }}};

module.exports = resolvers;