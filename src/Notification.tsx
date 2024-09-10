import { cn } from "@/lib/utils";

interface ErrorNotificationProps {
  msg: string;
  type: "error" | "success";
}

// TODO maybe make a nice animation for this
export default function Notification({ msg, type }: ErrorNotificationProps) {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute inset-x-0 shadow-xl bg-white w-3/4 mx-auto -mt-1 rounded-lg rounded-t-none text-center p-4 rounded-md",
          type === "error" ? "bg-red-500" : "bg-green-500"
        )}
      >
        {msg}
      </div>
    </div>
  );
}
