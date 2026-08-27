export default function setupSurveyMock(mock) {
  const mockTargets = [
    { id: 1, name: 'All Staff' },
    { id: 2, name: 'Specialists' }
  ];

  mock.onGet(/surveys$/).reply(200, {
    data: {
      surveys: [
        { id: 1, title: 'Staff Feedback Survey', status: 'Published', responsesCount: 15, target: { name: 'All Staff' }, createdBy: { firstName: 'Mock', lastName: 'Admin' } },
        { id: 2, title: 'Customer Satisfaction', status: 'Draft', responsesCount: 0, target: { name: 'Specialists' }, createdBy: { firstName: 'Mock', lastName: 'User' } }
      ],
      meta: { totalItems: 2, totalPages: 1, page: 1 }
    }
  });

  mock.onGet(/survey-target$/).reply(200, {
    data: {
      targets: mockTargets,
      meta: { totalItems: 2, totalPages: 1, page: 1 }
    }
  });

  mock.onGet(/questions$/).reply(200, {
    data: {
      questions: [],
      meta: { totalItems: 0, totalPages: 1, page: 1 }
    }
  });
}
