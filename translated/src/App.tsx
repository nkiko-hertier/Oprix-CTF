import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import React, { useEffect } from "react";

import SignInPage from "./Pages/Landings/auth/SignIn";
import SignUpPage from "./Pages/Landings/auth/SignUp";
import DashboardLayout from "./Layouts/DashboardLayout";
import DashboardHome from "./Pages/Dashboard/Home";
import { RequireAuth } from "./Validators/RequireAuth";
import Users from "./Pages/Dashboard/Users";
import Settings from "./Pages/Dashboard/Settings";
import Competition from "./Pages/Competition";
import Challenge from "./Pages/Challenge";
import { Backdrop, CircularProgress } from "@mui/material";

export default function App() {

  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <Backdrop
        sx={(theme) => ({ color: '#423badff', zIndex: theme.zIndex.drawer + 1 })}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }



  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={isSignedIn ? <DashboardHome /> : <SignInPage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/competition/:id" element={<Competition />} />
          <Route path="/competition/:id/challenge/:challengeId" element={<Challenge />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
