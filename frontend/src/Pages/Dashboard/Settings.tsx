import { UserProfile } from "@clerk/clerk-react";

export default function Settings() {
    return (
        <div className="settings">
            <h1 className="my-4 text-lg font-semibold py-4">Settings</h1>
            <UserProfile>
                Hello world
            </UserProfile>
        </div>
    );
}