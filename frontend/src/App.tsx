import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import React from "react";

import SignInPage from "./Pages/Landings/auth/SignIn";
import SignUpPage from "./Pages/Landings/auth/SignUp";
import DashboardLayout from "./Layouts/DashboardLayout";
import DashboardHome from "./Pages/Dashboard/Home";
import { RequireAuth } from "./Validators/RequireAuth";
import Users from "./Pages/Dashboard/Users";
import Settings from "./Pages/Dashboard/Settings";
import Competition from "./Pages/Competition";
import { useEffect } from "react";

export default function App() {

  const { isLoaded, isSignedIn, getToken, sessionId } = useAuth();
  const [token, setToken] = React.useState<string | null>(null);
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  // useEffect(() => {
  //   // This will run once when the component mounts
  //   const fetchToken = async () => {
  //     const token = await getToken();
  //     console.log("Clerk Token:", token);
  //     setToken(token);
  //   }

  //   fetchToken();
  // }, [getToken]);



  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
              {sessionId}
              s{token}E
            </RequireAuth>
          }
        >
          <Route path="/" element={ isSignedIn ? <DashboardHome /> : <SignInPage />} />
          <Route path="/users" element={ <Users />} />
          <Route path="/settings" element={ <Settings />} />
          <Route path="/competition/:id" element={ <Competition />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
