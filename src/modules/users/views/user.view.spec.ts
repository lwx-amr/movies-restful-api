import { UserView } from './user.view';
import { User } from '../entities/user.entity';
import { User as UserType } from '../types/user.type';

describe('UserView', () => {
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    fullName: 'Test User',
    password: 'hashedpassword',
    createdAt: new Date('2024-12-15T12:00:00Z'),
    refreshToken: 'refreshToken',
  };

  const mockUsers: User[] = [
    {
      id: 1,
      username: 'testuser1',
      fullName: 'Test User 1',
      password: 'hashedpassword1',
      createdAt: new Date('2024-12-15T12:00:00Z'),
      refreshToken: 'refreshToken',
    },
    {
      id: 2,
      username: 'testuser2',
      fullName: 'Test User 2',
      password: 'hashedpassword2',
      createdAt: new Date('2024-12-15T13:00:00Z'),
      refreshToken: 'refreshToken',
    },
  ];

  it('should render a single user correctly', () => {
    const userView = new UserView(mockUser);
    const result = userView.render();
    const expected: UserType = {
      id: 1,
      username: 'testuser',
      fullName: 'Test User',
      createdAt: new Date('2024-12-15T12:00:00Z') as any,
    };
    expect(result).toEqual(expected);
  });

  it('should render multiple users correctly', () => {
    const userView = new UserView(mockUsers);
    const result = userView.render();
    const expected: UserType[] = [
      {
        id: 1,
        username: 'testuser1',
        fullName: 'Test User 1',
        createdAt: new Date('2024-12-15T12:00:00Z') as any,
      },
      {
        id: 2,
        username: 'testuser2',
        fullName: 'Test User 2',
        createdAt: new Date('2024-12-15T13:00:00Z') as any,
      },
    ];
    expect(result).toEqual(expected);
  });

  it('should handle an empty array correctly', () => {
    const userView = new UserView([]);
    const result = userView.render();
    expect(result).toEqual([]);
  });
});
