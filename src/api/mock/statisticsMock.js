export default function setupStatisticsMock(mock) {
  const mockStatistics = {
    userStats: { total: 1240, growth: 12.5 },
    roomStats: { total: 16, growth: 5.8 },
    reportStats: { 
      total: 342, 
      growth: -3.4, 
      monthlyReportComparison: [
        { month: 'Jan', count: 20 },
        { month: 'Feb', count: 15 },
        { month: 'Mar', count: 30 },
        { month: 'Apr', count: 45 },
        { month: 'May', count: 35 },
        { month: 'Jun', count: 25 },
        { month: 'Jul', count: 40 },
        { month: 'Aug', count: 38 },
        { month: 'Sep', count: 28 },
        { month: 'Oct', count: 42 },
        { month: 'Nov', count: 50 },
        { month: 'Dec', count: 38 }
      ],
      byStatus: {
        'Pending': 35,
        'In Progress': 112,
        'Resolved': 165,
        'Closed': 30
      }
    },
    surveyStats: { 
      total: 14, 
      growth: 16.7, 
      monthlySurveyResponses: [
        { month: 'Oct', count: 85 },
        { month: 'Nov', count: 110 },
        { month: 'Dec', count: 142 }
      ]
    },
    scheduleStats: { total: 95 }
  };

  mock.onGet(/statistics\/admin$/).reply(200, {
    data: mockStatistics
  });

  mock.onGet(/statistics$/).reply(200, {
    data: mockStatistics
  });

  mock.onGet(/stats\/admin$/).reply(200, {
    data: mockStatistics
  });
}
