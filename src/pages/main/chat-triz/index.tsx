import { useTranslation } from 'react-i18next';

import ChatInterface from '@/features/chat-triz/components/chat-interface';
import { DefaultLayout } from '@/layouts/default-layout';

const ChatTrizPage = () => {
  const { t } = useTranslation('pages.chat_triz');
  return (
    <DefaultLayout meta={{ title: t('page_meta_title') }}>
      <ChatInterface />
    </DefaultLayout>
  );
};

export default ChatTrizPage;
