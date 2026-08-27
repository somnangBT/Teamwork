export default function setupUserMock(mock) {
  const mockUsers = [
    { id: 1, firstName: 'Mock', lastName: 'Admin', email: 'admin@mock.com', role: { name: 'ADMIN' }, profile: { avatarUrl: '' } },
    { id: 2, firstName: 'Mock', lastName: 'User', email: 'user@mock.com', role: { name: 'USER' }, profile: { avatarUrl: '' } }
  ];

  mock.onGet(/user$/).reply(200, {
    data: {
      users: mockUsers,
      meta: { totalItems: 2, totalPages: 1, page: 1 }
    }
  });

  mock.onGet(/user\/\d+$/).reply(200, {
    data: mockUsers[0]
  });

  mock.onGet(/roles$/).reply(200, {
    data: {
      roles: [
        { id: 1, name: 'ADMIN' },
        { id: 2, name: 'TEACHER' },
        { id: 3, name: 'STUDENT' }
      ]
    }
  });
}
