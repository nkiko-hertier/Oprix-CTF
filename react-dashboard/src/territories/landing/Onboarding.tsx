import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { RoleBelongs } from '../../components/RoleBelongs';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const userRole = (user.publicMetadata.role as string) || 'USER';
    const redirectPath = RoleBelongs[userRole] || '/'; // fallback
    navigate(redirectPath);
  }, [isLoaded, isSignedIn, user, navigate]);

  // Show loading while user data is being fetched
  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return null; // Nothing to render because user will be redirected
}

export default Onboarding;
