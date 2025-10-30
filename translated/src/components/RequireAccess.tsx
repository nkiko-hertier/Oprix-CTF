import { useUser } from "@clerk/clerk-react";
import React from "react";

interface RequireAccessProps {
    roles: string[];
    children: React.ReactNode;
}

const RequireAccess: React.FC<RequireAccessProps> = ({ roles, children }) => {
    const { user } = useUser();
    const userRole = user?.publicMetadata?.role as string | undefined;
    const userRole1 = userRole ?? 'user';

    if (!(userRole1) || !roles.includes(userRole1)) {
        return null;
    }

    return <>{children}</>;
};

export default RequireAccess;
