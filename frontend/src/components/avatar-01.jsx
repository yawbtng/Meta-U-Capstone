
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarDemo({url, initials}) {
  return (
    <Avatar>
      <AvatarImage src={url} alt="profile picture" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}