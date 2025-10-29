import { CreateUserForm } from "@/components/createUser";
import { Plus } from "lucide-react";

export default function Users() {
    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="my-4 text-2xl font-semibold py-4">Users</h1>
                <CreateUserForm>
                    <button className="flex items-center text-sm gap-1 bg-indigo-500 text-white rounded-md p-2 px-3 h-fit"><Plus size={14} /> Create user</button>
                </CreateUserForm>
            </div>
            <hr />
            <div className="mt-3">
                <div className="rounded-md p-1 min-h-10 bg-background dark:bg-zinc-950/50">
                    <div className="grid grid-cols-3 px-5 py-2 text-muted-foreground text-sm">
                        <div>User</div>
                        <div>Join At</div>
                        <div>Actions</div>
                    </div>
                    <div className="bg-card border border-border border-dashed rounded-md">
                        <div className="grid grid-cols-3 items-center px-5 py-2 text-muted-foreground text-sm">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center">N</div>
                                    <div>
                                        <div className="font-semibold text-foreground">Nkiko Hertier</div>
                                        <div className="text-xs">afrigames@gmail.com</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Sep 27, 2025</p>
                            </div>
                            <div>Actions</div>
                        </div>
                        <div className="grid grid-cols-3 items-center px-5 py-2 text-muted-foreground text-sm">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 text-white rounded-full bg-indigo-400 flex justify-center items-center">N</div>
                                    <div>
                                        <div className="font-semibold text-foreground">Nkiko Hertier</div>
                                        <div className="text-xs">afrigames@gmail.com</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Sep 27, 2025</p>
                            </div>
                            <div>Actions</div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}