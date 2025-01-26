import { expect } from "chai";
import sinon from 'sinon';
import useSignup from "../components/SignupPage/useSignup";

describe("useSignup", () => {
  let originalFetch;
  let contextMock;

  beforeEach(() => {
    originalFetch = global.fetch;
    contextMock = { setAuthUser: sinon.spy() };

    global.fetch = async (url, options) => {
      if (url === "/signup" && options.method === "POST") {
        return {
          ok: true,
          json: async () => ({ name: "John Doe", email: "john.doe@example.com" }),
        };
      }
      return { ok: false, json: async () => ({ message: "Signup failed" }) };
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should successfully sign up the user", async () => {
    const signup = useSignup(contextMock.setAuthUser);

    const result = await signup(
      "John Doe",
      "john.doe@example.com",
      "Password123!",
      "citizen",
      30,
      false,
      "no",
      "other",
      "male"
    );

    expect(result).to.be.true;
  });
});