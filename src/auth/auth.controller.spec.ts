import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('deve retornar token no login', async () => {
    const loginDto = { email: 'gabriel@test.com', password: 'password' };
    mockAuthService.login.mockResolvedValue({ access_token: 'token_valido' });

    const result = await controller.login(loginDto);
    expect(result).toHaveProperty('access_token');
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
  });
});
