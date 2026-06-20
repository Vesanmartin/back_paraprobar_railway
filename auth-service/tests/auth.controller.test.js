import { jest } from "@jest/globals";

jest.unstable_mockModule(
  "../src/services/auth.service.js",
  () => ({
    loginUser: jest.fn(),
    registerUser: jest.fn(),
  })
);

const {
  loginUser,
  registerUser
} = await import("../src/services/auth.service.js");
const {
  login,
  register,
  verifyCode
} = await import("../src/controllers/auth.controller.js");
describe("Auth Controller", () => {

  beforeEach(() => {

    jest.clearAllMocks();

  });

    test("Debe responder 200", async () => {

    loginUser.mockResolvedValue({
      token: "token-falso",
      rol: "admin"
    });

    const req = {
      body: {
        email: "admin@gmail.com",
        password: "1234"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(200);

  });

  test("Debe registrar usuario correctamente", async () => {

    registerUser.mockResolvedValue({
      mensaje: "Usuario registrado correctamente"
    });

    const req = {
      body: {
        email: "nuevo@gmail.com",
        password: "1234"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(201);

  });
  test("Debe responder 400 cuando register falla", async () => {

  registerUser.mockRejectedValue(
    new Error("Usuario ya existe")
  );

  const req = {
    body: {
      email: "nuevo@gmail.com",
      password: "1234"
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await register(req, res);

  expect(res.status)
    .toHaveBeenCalledWith(400);

});
test("Debe responder 401 cuando no existe sesión", async () => {

  const req = {
    body: {
      email: "fake@gmail.com",
      code: "123456"
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await verifyCode(req, res);

  expect(res.status)
    .toHaveBeenCalledWith(401);

});

});