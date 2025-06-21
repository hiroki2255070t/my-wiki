import bookData from '../../docs/books/book_list.json';
import { Book } from '../types/book';

export function getBookTitleByISBN(isbn: string): string | undefined {
  const bookList: Book[] = bookData.book_list;

  const foundBook = bookList.find((book) => book.ISBN === isbn);

  if (foundBook) {
    return foundBook.title;
  } else {
    return undefined;
  }
}
