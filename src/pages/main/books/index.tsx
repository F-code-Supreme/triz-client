import { useState } from 'react';
import { ReactReader } from 'react-reader';

import Book1 from '@/assets/epub/1.epub';
import { DefaultLayout } from '@/layouts/default-layout';

import type { Contents } from 'epubjs';

const BookLibraryPage = () => {
  const [location, setLocation] = useState<string | number>(0);

  return (
    <DefaultLayout meta={{ title: 'Book Library' }}>
      <div className="h-screen">
        <ReactReader
          url={Book1}
          location={location}
          locationChanged={setLocation}
          swipeable
          getRendition={(_rendition) => {
            _rendition.hooks.content.register((_: Contents) => {
              // @ts-expect-error - manager type is missing in epubjs Rendition
              _rendition.manager.container.style['scroll-behavior'] = 'smooth';
            });
          }}
        />
      </div>
    </DefaultLayout>
  );
};

export default BookLibraryPage;
