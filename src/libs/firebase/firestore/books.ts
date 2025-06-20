import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';

import { BookSchema, Book } from '../../../types/book';

export async function getBookList(): Promise<Book[]> {
  const querySnapshot = await getDocs(collection(db, 'books'));

  const bookList: Book[] = querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    const parsed = BookSchema.safeParse(data);

    if (!parsed.success) {
      console.error(
        `Invalid document in bookList: ${docSnap.id}`,
        parsed.error
      );
      throw new Error(`Invalid data in document ${docSnap.id}`);
    }

    return parsed.data;
  });

  return bookList;
}

export async function addOrUpdateBook(book: unknown): Promise<void> {
  const parsed = BookSchema.safeParse(book);

  if (!parsed.success) {
    console.error('Invalid book data:', parsed.error);
    throw new Error('Book data validation failed');
  }

  const validBook: Book = parsed.data;

  const docRef = doc(collection(db, 'books'), validBook.ISBN);
  await setDoc(docRef, validBook, { merge: true });
  console.log(`Book with ISBN=${validBook.ISBN} has been set successfully.`);
}
