import { expect } from "chai";

describe("useSignup", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;

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
    // Restore the original fetch function after tests
    global.fetch = originalFetch;
  });

  it("should successfully sign up the user", async () => {
    const mockSetAuthUser = (user) => {}; 
    const signup = useSignup(mockSetAuthUser); // Call useSignup with the mocked context function

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

    expect(result).to.be.true; // Check if the result is true,successful signup
  });
});
