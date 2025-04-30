// mock/user.ts
import Mock from "mockjs";

export default [
  {
    url: "/api/login",
    method: "post",
    timeout: 300,
    response: ({ body }: { body: string }) => {
      const { username, password } = JSON.parse(body);
      if (username === "admin" && password === "123456") {
        const token = Mock.mock("@guid");
        return {
          code: 200,
          message: "Login success",
          data: { token: token },
        };
      } else {
        return {
          code: 401,
          message: "Invalid username or password",
        };
      }
    },
  },
  {
    url: "/api/user/info",
    method: "get",
    response: () => ({
      code: 200,
      data: Mock.mock({
        "id|1-1000": 1,
        name: "@cname",
        avatar: '@image("200x200")',
      }),
    }),
  },
];
