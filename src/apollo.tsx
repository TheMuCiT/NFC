import {ApolloClient, InMemoryCache} from '@apollo/client';

import {createUploadLink} from 'apollo-upload-client';

const link = createUploadLink({uri: 'http://10.0.2.2:4000/graphql'});

export const client = new ApolloClient({
  uri: 'http://10.0.2.2:4000/graphql',
  cache: new InMemoryCache(),
});
