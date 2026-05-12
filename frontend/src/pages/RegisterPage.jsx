import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { theme } from "../utils/theme";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosClient.post("/auth/register", formData);
      login({ token: data.token, user: data.user });
      toast.success("Registered successfully");
      navigate(data.user.role === "admin" ? "/admin-dashboard" : "/citizen-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center">
      <div className={`mx-auto w-full max-w-md ${theme.card}`}>
        <h2 className="mb-4 text-2xl font-semibold">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          className={theme.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={theme.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={theme.input}
          minLength={6}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={theme.input}
        >
          <option value="citizen">Citizen</option>
          <option value="admin">Admin</option>
        </select>
        <button className={theme.buttonPrimary}>
          Register
        </button>
        </form>
        <p className="mt-4 text-sm text-slate-200">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-300 hover:text-blue-200">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
