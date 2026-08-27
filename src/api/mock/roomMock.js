export default function setupRoomMock(mock) {
  const mockRooms = [
    { id: 1, name: 'Room A', capacity: 2, isActive: true },
    { id: 2, name: 'Room B', capacity: 4, isActive: true }
  ];

  const allSchedules = [
    { 
      id: 1, 
      date: '2026-08-27', 
      room: { id: 1, name: 'Room A' }, 
      session: 'Morning Session',
      startTime: '09:00', 
      endTime: '12:00',
      teacher: { 
        id: 1, 
        firstName: 'John', 
        lastName: 'Doe', 
        profile: { avatarUrl: '' } 
      },
      subject: 'Hair Styling Techniques',
      className: 'Class A',
      status: 'SCHEDULED',
      dates: ['2026-08-27', '2026-08-28']
    },
    { 
      id: 2, 
      date: '2026-08-27', 
      room: { id: 2, name: 'Room B' }, 
      session: 'Afternoon Session',
      startTime: '13:00', 
      endTime: '16:00',
      teacher: { 
        id: 2, 
        firstName: 'Jane', 
        lastName: 'Smith', 
        profile: { avatarUrl: '' } 
      },
      subject: 'Skincare Therapy',
      className: 'Class B',
      status: 'PENDING',
      dates: ['2026-08-27']
    },
    { 
      id: 3, 
      date: '2026-08-29', 
      room: { id: 1, name: 'Room A' }, 
      session: 'Full Day Session',
      startTime: '08:00', 
      endTime: '17:00',
      teacher: { 
        id: 3, 
        firstName: 'Robert', 
        lastName: 'Lee', 
        profile: { avatarUrl: '' } 
      },
      subject: 'Nail Art Masterclass',
      className: 'Class C',
      status: 'PENDING',
      dates: ['2026-08-29']
    },
    { 
      id: 4, 
      date: '2026-08-28', 
      room: { id: 2, name: 'Room B' }, 
      session: 'Evening Session',
      startTime: '18:00', 
      endTime: '21:00',
      teacher: { 
        id: 1, 
        firstName: 'John', 
        lastName: 'Doe', 
        profile: { avatarUrl: '' } 
      },
      subject: 'Makeup Application',
      className: 'Class A',
      status: 'REJECTED',
      dates: ['2026-08-28']
    }
  ];

  mock.onGet(/rooms$/).reply(200, {
    data: {
      rooms: mockRooms,
      meta: { totalItems: 2, totalPages: 1, page: 1 }
    }
  });

  mock.onGet(/room\/\d+$/).reply(200, {
    data: mockRooms[0]
  });

  mock.onGet(/rooms\/types$/).reply(200, {
    data: ['Treatment', 'Spa']
  });

  mock.onGet(/rooms\/availability\/types$/).reply(200, {
    data: ['Open', 'Closed']
  });

  mock.onGet(/rooms\/session\/types$/).reply(200, {
    data: ['Morning', 'Afternoon']
  });

  mock.onGet(/rooms\/schedule\/types$/).reply(200, {
    data: ['SCHEDULED', 'CANCELLED', 'REJECTED', 'IN_PROGRESS', 'DONE']
  });

  mock.onGet(/room-sessions$/).reply(200, {
    data: {
      data: [
        { id: 1, date: '2026-08-27', room: { name: 'Room A' }, timeStart: '09:00', timeEnd: '10:00' }
      ],
      meta: { totalItems: 1, totalPages: 1, page: 1 }
    }
  });

  mock.onGet(/room-schedules$/).reply(config => {
    const params = config.params || {};
    const status = params.status;
    
    let filteredSchedules = allSchedules;
    if (status) {
      filteredSchedules = allSchedules.filter(s => s.status === status);
    }
    
    return [200, {
      data: {
        schedule: filteredSchedules,
        meta: { totalItems: filteredSchedules.length, currentPage: 1, totalPages: 1 }
      }
    }];
  });

  // Mock PUT requests for approving/rejecting booking requests
  mock.onPut(/\/room-schedules\/\d+\/approve$/).reply(200, {
    success: true,
    message: 'Booking request approved successfully'
  });

  mock.onPut(/\/room-schedules\/\d+\/reject$/).reply(200, {
    success: true,
    message: 'Booking request rejected successfully'
  });

  mock.onPut(/\/room-schedules\/\d+\/status$/).reply(200, {
    success: true,
    message: 'Booking status updated successfully'
  });

  mock.onDelete(/\/room-schedules\/\d+$/).reply(200, {
    success: true,
    message: 'Booking deleted successfully'
  });
}
