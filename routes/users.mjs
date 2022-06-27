import mocks from '../mocks/index.mjs';

export default [
  {
    id: 'get-user',
    url: '/api/user/:id',
    method: 'GET',
    result: mocks.User(),
    errors: [
      {
        id: 'not-found',
        response: {
          status: 404,
        },
      },
    ],
  },
];
