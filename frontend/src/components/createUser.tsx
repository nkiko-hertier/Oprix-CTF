// src/components/CreateUserForm.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // Import Zod directly for a simple schema
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner"; // Assuming you use a toast notification system

// --- 1. Define the Zod Schema for a New User ---
const userSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Must be a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type UserFormValues = z.infer<typeof userSchema>;

// --- 2. The CreateUserForm Component ---
export function CreateUserForm({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    // 💡 Add the hardcoded role property here for the API payload
    const payload = {
      ...values,
      role: "hoster",
    };

    console.log("New User Payload (to be sent to secure API):", payload);

    try {
        // TODO: Replace this with an actual secure API call to your backend
        // Your API route will then call clerkClient.users.createUser(payload)
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        
        toast("Success! User Created 🎉",{
            description: `A new hoster account has been created for ${payload.email}.`,
        });

        form.reset();
        setIsOpen(false); // Close the dialog on success

    } catch (error) {
        console.error("User creation failed:", error);
        toast({
            title: "Error Creating User",
            description: "Please check the server logs.",
            variant: "destructive",
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ?? <Button>Create New User</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-sidebar">
        <DialogHeader>
          <DialogTitle>Create Hoster Account 🛠️</DialogTitle>
          <DialogDescription>
            Register a new hoster account. The role will be set to "hoster" automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* 1. Name Fields */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Jane" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* 2. Email Field */}
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="name@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* 3. Password Field */}
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter a secure password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* 4. Footer (Submit Button) */}
            <DialogFooter className="mt-6">
              <Button type="submit">Create Hoster</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}