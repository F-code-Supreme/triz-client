import { useTranslation } from 'react-i18next';

import { DefaultLayout } from '@/layouts/default-layout';

const ChatTrizPage = () => {
  const { t } = useTranslation('pages.chat_triz');
  return (
    <DefaultLayout meta={{ title: t('page_meta_title') }}>
      <div>Chat TRIZ Page</div>
    </DefaultLayout>
  );
};

export default ChatTrizPage;
