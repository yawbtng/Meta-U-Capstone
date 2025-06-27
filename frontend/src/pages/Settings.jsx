import {useEffect, useState} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent,  CardDescription, CardFooter, CardHeader, CardTitle  } from "@/components/ui/card"
import { Camera, Mail, MapPin } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

function AccountSettings() {
    return (
      <Card className="my-30 scale-125 ">
        <CardHeader>
          <CardTitle className="text-2xl">Account Settings</CardTitle>
          <CardDescription>Update your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Yaw Boateng" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="yawbtng@meta.com" />
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    )
  }

function ProfileHeader() {
  return (
    <Card className="scale-125 mt-20">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
              <AvatarFallback>YB</AvatarFallback>
            </Avatar>
            <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
              <Camera className="h-4 w-4" />
              <span className="sr-only">Change avatar</span>
            </Button>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold">Yaw Boateng</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>yawbtng@meta.com</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>San Francisco, CA</span>
            </div>
          </div>
          {/* <div className="md:ml-auto">
            <Button>Edit Profile</Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}




const UserProfile = () => {
    const [user, setUser] = useState(null);

    return (
        <div className="container mx-auto py-5 space-y-8">
          <h1 className="font-bold">Profile & Settings</h1>
          <div className="grid gap-8">
            <ProfileHeader />
            <div className="grid gap-8">
              <div className="space-y-10">
                <section id="account">
                  <AccountSettings />
                </section>
              </div>
            </div>
          </div>
        </div>
      )
}

export default UserProfile;
