"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const response = await fetch("/api/notifications", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('notifications',response)
                const data = await response.json();
                console.log('notif', data)
                setNotifications(data); 
                if (!response.ok) {
                    throw new Error("Failed to fetch notifications");
                }

            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getNotifications();
    }, []);

    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="relative">
                        <Bell className="h-6 w-6" />
                        {notifications.length > 0 && (
                            <Badge
                                variant="danger"
                                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-xs"
                            >
                                {notifications.length}
                            </Badge>
                        )}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    {isLoading ? (
                        <DropdownMenuItem>Loading...</DropdownMenuItem>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <DropdownMenuItem key={index}>
                                {notification.message}
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem>No new notifications</DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
