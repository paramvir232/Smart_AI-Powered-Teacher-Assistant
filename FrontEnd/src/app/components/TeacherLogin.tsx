// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReactLoadableManifest } from "next/dist/server/load-components";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function TeacherLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // new state


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://ai-teacher-api-xnd1.onrender.com/teacher/login/",
        {
          id,
          password,
        }
      );

      if (response.data.Message === "Success Login") {
        sessionStorage.setItem("teacherId", response.data.ID);
        toast.success("Login Successful");
        window.location.href = "/dashboard/teacher";
      } else {
        toast.error("Please check your credentials");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="flex w-full">
      <form
        onSubmit={handleLogin}
        className="bg-secondary p-6 rounded-lg shadow-lg w-full"
      >
        <h2 className="text-2xl text-center  font-bold mb-4">Teacher Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <Input
          type="number"
          placeholder="Teacher Id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
