export default function setupReportMock(mock) {
  const mockCategories = [
    { id: 1, name: 'Facility' },
    { id: 2, name: 'Equipment' },
    { id: 3, name: 'Services' }
  ];

  mock.onGet(/report$/).reply(200, {
    data: {
      reports: [
        { id: 1, title: 'Broken Chair', category: { name: 'Facility' }, status: 'Pending', date: '2026-08-26', user: { firstName: 'Mock', lastName: 'User' } },
        { id: 2, title: 'Slow Internet', category: { name: 'Equipment' }, status: 'Resolved', date: '2026-08-25', user: { firstName: 'Mock', lastName: 'Admin' } }
      ],
      meta: { totalItems: 2, totalPages: 1, page: 1 }
    }
  });

  mock.onGet(/own\/report/).reply(200, {
    data: {
      reports: [],
      meta: { totalItems: 0, totalPages: 1, page: 1 }
    }
  });

  mock.onGet(/category$/).reply(200, {
    data: {
      categories: mockCategories,
      meta: { totalItems: 3, totalPages: 1, page: 1 }
    }
  });

  mock.onGet(/report\/status$/).reply(200, {
    data: {
      statuses: [
        { id: 'Pending', name: 'Pending' },
        { id: 'In Progress', name: 'In Progress' },
        { id: 'Resolved', name: 'Resolved' },
        { id: 'Closed', name: 'Closed' }
      ]
    }
  });
}
