
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarDemo({url, initials, className}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={url} alt="profile picture" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}