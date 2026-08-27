export default function setupAuthMock(mock) {
  mock.onPost(/auth\/login/).reply(200, {
    data: {
      tokens: {
        accessToken: 'mock-access-token'
      },
      user: {
        id: 1,
        firstName: 'Mock',
        lastName: 'User',
        email: 'user@mock.com',
        role: { name: 'ADMIN' }
      }
    },
    message: 'Login successful'
  });

  mock.onGet(/auth\/profile/).reply(200, {
    user: {
      id: 1,
      firstName: 'Mock',
      lastName: 'User',
      email: 'user@mock.com',
      role: { name: 'ADMIN' }
    }
  });

  mock.onPost(/auth\/refresh-token/).reply(200, {
    user: {
      accessToken: 'new-mock-access-token'
    }
  });

  mock.onPost(/auth\/logout/).reply(200, {
    message: 'Logout successful'
  });
}
