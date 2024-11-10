import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AuthButton() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button
        onClick={() => signIn("google")}
        className="font-bold bg-white text-black border border-gray-300 shadow-none hover:bg-grey-100"
      >
        Log in
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={session.user.image || "/default-avatar.png"}
            alt="User Avatar"
          />
        </Avatar>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 min-w-[150px] w-auto" // Remove padding and set width to auto
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="flex flex-col">
          <Select>
            <SelectTrigger className="w-full text-left px-4 py-2">
              <span>Settings</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profile">Profile</SelectItem>
              <SelectItem value="preferences">Preferences</SelectItem>
              <SelectItem value="notifications">Notifications</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            className="w-full text-left px-4 py-2"
            onClick={() => signOut()}
          >
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
