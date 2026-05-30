import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getMe,
} from "../services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  const { user, loading, setLoading, login, logout } = context;

  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);

      const data = await loginApi({ email, password });

      login(data.user);

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    try {
      setLoading(true);

      const data = await registerApi({
        username,
        email,
        password,
      });

      login(data.user);

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
    getMe,
  };
};
