import { readme } from '@/assets/readme';
import { BackToTop } from '@/components/back-to-top/back-to-top';
import { Markdown } from '@/components/markdown/markdown';
import { DefaultLayout } from '@/layouts/default-layout';
import './styles.scss';

const HomePage = () => {
  return (
    <DefaultLayout
      meta={{
        title: 'Home Page - Triz',
      }}
    >
      <div className="border rounded-lg p-5 bg-card space-y-8 markdown-container">
        <Markdown content={readme} />
      </div>
      <BackToTop />
    </DefaultLayout>
  );
};

export default HomePage;
