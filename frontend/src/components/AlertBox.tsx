import { useState, type ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface AlertProps {
  children: ReactNode;
  title?: string;
  type?: "Success" | "Warning" | "Normal" | "Dangerous";
}

export default function AlertBox({
  children,
  type = "Normal",
  title,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const isType = (real: "Success" | "Warning" | "Normal" | "Dangerous") => {
    return type == real;
  };

  if (!isVisible) return null; // hide alert if not visible

  return (
    <Alert
      className={cn("relative border-none", {
        "bg-blue-500/10 text-blue-500": isType("Normal"),
        "bg-red-500/10 text-red-500": isType("Dangerous"),
        "bg-green-500/10 text-green-500": isType("Success"),
        "bg-orange-500/10 text-orange-500": isType("Warning"),
      })}
    >
      <AlertTitle>{title ?? "Announcement"}</AlertTitle>
      <AlertDescription>
        {children ?? "Your action was completed successfully."}
      </AlertDescription>
      <button
        onClick={() => setIsVisible(false)}
        className="p-1 w-fit rounded hover:bg-gray-700 absolute top-3 right-3"
      >
        <X className="w-4 h-4" />
      </button>
    </Alert>
  );
}
