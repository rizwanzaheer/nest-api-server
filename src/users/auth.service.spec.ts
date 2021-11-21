import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async (done) => {
    fakeUserService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    try {
      await service.signup('asdf@asdf.com', 'asdf');
    } catch (e) {
      done();
    }
  });

  it('throws if sign in is called with an unused email ', async (done) => {
    try {
      await service.signin('asdf@asdf.com', 'asdf');
    } catch (e) {
      done();
    }
  });

  it('throws if an invalid password is provided', async (done) => {
    fakeUserService.find = () =>
      Promise.resolve([{ email: 'asdf@asdf.com', password: 'asdf' } as User]);

    try {
      await service.signin('asdfsdf@asdf.com', 'mypassword');
    } catch (e) {
      done();
    }
  });

  it('return a user if correct password is provided', async (done) => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          email: 'asdf@asdf.com',
          password:
            '1a8d70bdc45a7a6e.9fd5f31ff47d90d9cdbcb9a54346b4bf3797f9705dbf4fe01287f0e7b3fdcd2d',
        } as User,
      ]);

    try {
      const user = await service.signin('asdfsdf@asdf.com', 'mypassword');
      expect(user).toBeDefined();
    } catch (e) {
      done();
    }

    // const user = await service.signup('asdfsdf@asdf.com', 'mypassword');
    // console.log('user: ', user);
  });
});
