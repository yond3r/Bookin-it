import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_ME} from '..utils/queries';
import {REMOVE_BOOK} from '..utils/mutations';
import Auth from '../utils/localStorage';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const {loading, data} = useQuery(GET_ME);
  const [deleteBook] = useMutation(REMOVE_BOOK);
  const userData = data?.me || {};

  if (!userData?.username){
    return(
      <h4>Sorry, but you need to be logged-in, in order to see this page! Come back after you've logged and/or signed-in!</h4>
    )};

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBook({
        variables: {bookId: bookId},
        update: cache => {
          const data = cache.readQuery({query: GET_ME});
          const userData = data.me;
          const savedBooksCache = userDataCache.savedBooks;
          const updatedBooksCache = savedBooksCache.filter((book) => book.bookId !== bookId);
            data.me.savedBooks = updatedBooksCache;
            cache.writeQuery({query: GET_ME, data: {data: {...data.me.savedBooks}}});
        }});

        //removing from local storage
        removeBookId(bookId);
      } catch (err) {
        console.log(err)
      }};
  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
