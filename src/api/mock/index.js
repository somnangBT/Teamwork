import MockAdapter from 'axios-mock-adapter';
import setupAuthMock from './authMock';
import setupRoomMock from './roomMock';
import setupReportMock from './reportMock';
import setupSurveyMock from './surveyMock';
import setupUserMock from './userMock';
import setupStatisticsMock from './statisticsMock';

export function setupMockApi(apiInstance) {
  const mock = new MockAdapter(apiInstance, { delayResponse: 500 });


  setupAuthMock(mock);
  setupRoomMock(mock);
  setupReportMock(mock);
  setupSurveyMock(mock);
  setupUserMock(mock);
  setupStatisticsMock(mock);

  // Generic fallback for any unhandled GET request
  mock.onGet().reply(config => {
      console.warn(`[Mock API] Unhandled GET request to ${config.url}`);
      return [200, { data: { data: [], meta: { totalItems: 0, totalPages: 1, page: 1 } }, message: 'Success' }];
  });

  // Generic fallback for any unhandled POST/PUT/DELETE/PATCH request
  mock.onAny().reply(config => {
      console.warn(`[Mock API] Unhandled ${config.method.toUpperCase()} request to ${config.url}`);
      return [200, { success: true, message: 'Success (Mocked)', data: {} }];
  });

  console.log('[Mock API] Setup complete.');
}
