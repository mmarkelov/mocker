import { fileURLToPath } from 'url';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const typesArray = loadFilesSync(dirname, { extensions: ['graphql'] });

export default mergeTypeDefs(typesArray);
