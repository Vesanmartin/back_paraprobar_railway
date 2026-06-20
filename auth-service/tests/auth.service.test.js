import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";


jest.unstable_mockModule("../src/models/user.model.js", () => ({
  buscarPorEmail: jest.fn(),
  crearUsuario: jest.fn()
}));

const {
  buscarPorEmail,
  crearUsuario
} = await import("../src/models/user.model.js");

const {
  loginUser,
  registerUser
} = await import("../src/services/auth.service.js");

describe("Auth Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
  });

  test("Debe rechazar usuario inexistente", async () => {

    buscarPorEmail.mockResolvedValue(null);

    await expect(
      loginUser(
        "admin@gmail.com",
        "1234"
      )
    ).rejects.toThrow("Usuario no existe");

  });

  test("Debe rechazar contraseña incorrecta", async () => {

    const passwordHash =
      await bcrypt.hash("1234", 10);

    buscarPorEmail.mockResolvedValue({
      id: 1,
      email: "admin@gmail.com",
      password: passwordHash,
      rol: "admin"
    });

    await expect(
      loginUser(
        "admin@gmail.com",
        "9999"
      )
    ).rejects.toThrow("Contraseña incorrecta");

  });

  test("Debe autenticar usuario correctamente", async () => {

    const passwordHash =
      await bcrypt.hash("1234", 10);

    buscarPorEmail.mockResolvedValue({
      id: 1,
      email: "admin@gmail.com",
      password: passwordHash,
      rol: "admin"
    });

    const resultado = await loginUser(
      "admin@gmail.com",
      "1234"
    );

    expect(resultado).toHaveProperty("token");
    expect(resultado.rol).toBe("admin");
    expect(resultado.email)
      .toBe("admin@gmail.com");

  });

  test("Debe registrar usuario nuevo", async () => {

    buscarPorEmail.mockResolvedValue(null);

    crearUsuario.mockResolvedValue({
      id: 1
    });

    const resultado = await registerUser(
      "nuevo@gmail.com",
      "1234"
    );

    expect(resultado.mensaje)
      .toBe("Usuario registrado correctamente");

  });

  test("Debe impedir registrar usuario repetido", async () => {

    buscarPorEmail.mockResolvedValue({
      id: 1,
      email: "nuevo@gmail.com"
    });

    await expect(
      registerUser(
        "nuevo@gmail.com",
        "1234"
      )
    ).rejects.toThrow("Usuario ya existe");

  });

});