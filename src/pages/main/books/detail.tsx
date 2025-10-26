import { Route } from '@/routes/books.$bookId';

const BookDetailPage = () => {
  const { bookId } = Route.useParams();
  return <div>Book Detail Page: {bookId}</div>;
};

export default BookDetailPage;
