import i18n from '..';
import { lowerCaseFormatter } from './lowercase';
import { upperCaseFormatter } from './uppercase';

i18n.services.formatter?.add('lowercase', lowerCaseFormatter);
i18n.services.formatter?.add('uppercase', upperCaseFormatter);
