import { addOrUpdateBook } from './books';
import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;

async function main() {
  const raw = fs.readFileSync(
    path.resolve(__dirname, '../../../../docs/books/book_list.json'),
    'utf8'
  );
  const list = JSON.parse(raw).book_list as unknown[];

  for (const item of list) {
    try {
      await addOrUpdateBook(item);
      console.log(`OK → ${(item as any).title}`);
    } catch (e) {
      console.error(`NG → ${(item as any).title}:`, e);
    }
  }
}

main().catch(console.error);
