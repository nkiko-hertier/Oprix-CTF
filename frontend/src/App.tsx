import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignInPage from "./Pages/Landings/auth/SignIn";
import SignUpPage from "./Pages/Landings/auth/SignUp";
import Home from "./Pages/Landings/Home";
import DashboardLayout from "./Layouts/DashboardLayout";
import DashboardHome from "./Pages/Dashboard/Home";
import { RequireAuth } from "./Validators/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/" element={<Home />} />
        <Route
          element={
            <RequireAuth>
              {" "}
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
