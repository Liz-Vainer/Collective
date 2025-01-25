import { render, act } from "@testing-library/react";
import { expect } from "chai";
import sinon from "sinon";
import React, { useState, useEffect } from "react";
import useLogin from "../../components/login/useLogin"; 

const TestComponent = ({ setAuthUser }) => {
  const login = useLogin({ setAuthUser });
  const [loginResult, setLoginResult] = useState(null);

  useEffect(() => {
    const testLogin = async () => {
      const result = await login("John", "Password123");
      setLoginResult(result);
    };
    testLogin();
  }, [login]);

  return <div>{loginResult === null ? "Loading..." : loginResult ? "Success" : "Failure"}</div>;
};

describe("useLogin", () => {
  let fetchStub, setAuthUserStub;

  beforeEach(() => {
    fetchStub = sinon.stub(global, "fetch");
    setAuthUserStub = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  // Test for login with valid credentials
  describe("login with valid credentials", () => {
    it("should return true and set user data on successful login", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ name: "John Doe", token: "12345" }),
      };
      fetchStub.resolves(mockResponse);

      const { getByText } = render(<TestComponent setAuthUser={setAuthUserStub} />);
      
      await act(async () => {
        // wait for the effect to complete
      });

      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.calledWith("/login", sinon.match.any)).to.be.true;
      expect(setAuthUserStub.calledWith({ name: "John Doe", token: "12345" })).to.be.true;
      expect(getByText("Success")).to.exist;
    });
  });

  // Test for login with invalid credentials
  describe("login with invalid credentials", () => {
    it("should return false on failed login attempt", async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ message: "Invalid credentials" }),
      };
      fetchStub.resolves(mockResponse);

      const { getByText } = render(<TestComponent setAuthUser={setAuthUserStub} />);
      
      await act(async () => {
        // wait for the effect to complete
      });

      expect(fetchStub.calledOnce).to.be.true;
      expect(getByText("Failure")).to.exist;
    });
  });

  // Test for error handling during fetch failure (e.g. network issues)
  describe("login error handling", () => {
    it("should return false if there is a fetch error", async () => {
      fetchStub.rejects(new Error("Network error"));

      const { getByText } = render(<TestComponent setAuthUser={setAuthUserStub} />);

      await act(async () => {
        // wait for the effect to complete
      });

      expect(fetchStub.calledOnce).to.be.true;
      expect(getByText("Failure")).to.exist;
    });
  });
});
