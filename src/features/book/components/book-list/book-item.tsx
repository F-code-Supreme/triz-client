import { Link } from '@tanstack/react-router';
import { BookOpen, Calendar, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { Book } from '../../types';

type BookItemProps = {
  book: Book;
};

const BookItem = ({ book }: BookItemProps) => {
  return (
    <Link key={book.id} to="/books/$bookId" params={{ bookId: book.id }}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
        {/* Book Cover */}
        <div className="relative w-full h-48 bg-gradient-to-br from-sky-200 to-blue-400 overflow-hidden">
          {book.bCoverUrl ? (
            <img
              src={book.bCoverUrl}
              alt={book.title || 'Book cover'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-white/50" />
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {book.title || 'Untitled Book'}
            </h3>
          </div>

          {/* Author */}
          {book.author && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{book.author}</span>
            </div>
          )}

          {/* Publisher */}
          {book.publisher && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{book.publisher}</span>
            </div>
          )}

          {/* Read Button */}
          <Button
            variant="default"
            className="w-full mt-4"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Read Book
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BookItem;
