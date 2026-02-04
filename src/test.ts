import {QueryEngine} from ".";

class User {}
class Post {}
class Book {}

const queryEngine = new QueryEngine({
  documents: {
    user: {
      model: User
    },
    post: {
      model: Post
    },
    book: {
      model: Book
    },
  }
});

const query = queryEngine.query('user');

query

console.log({ queryEngine });
