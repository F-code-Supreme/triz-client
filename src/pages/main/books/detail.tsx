import BookReader from '@/features/book/components/book-reader';
import { Route } from '@/routes/books.$bookId.index';

const BookDetailPage = () => {
  const { bookId } = Route.useParams();
  return <BookReader bookId={bookId} />;
};

export default BookDetailPage;
