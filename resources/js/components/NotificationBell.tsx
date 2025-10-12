import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Bell, Check, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
// Fonction utilitaire pour formater les dates
const formatDistanceToNow = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'il y a quelques secondes';
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''}`;
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heure${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''}`;
    if (diffInSeconds < 2592000) return `il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`;
    return `il y a ${Math.floor(diffInSeconds / 2592000)} mois`;
};

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    data: any;
    read: boolean;
    created_at: string;
}

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'nouvelle_commande':
            return <ShoppingCart className="h-4 w-4 text-blue-500" />;
        case 'stock_faible':
            return <AlertTriangle className="h-4 w-4 text-orange-500" />;
        case 'statut_commande_modifie':
            return <Package className="h-4 w-4 text-green-500" />;
        default:
            return <Bell className="h-4 w-4 text-gray-500" />;
    }
};

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Charger les notifications au montage du composant
    useEffect(() => {
        loadNotifications();
        loadUnreadCount();
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await fetch('/api/notifications/recent');
            const data = await response.json();
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Erreur lors du chargement des notifications:', error);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const response = await fetch('/api/notifications/unread-count');
            const data = await response.json();
            setUnreadCount(data.count || 0);
        } catch (error) {
            console.error('Erreur lors du chargement du nombre de notifications:', error);
        }
    };

    const markAsRead = async (notificationId: number) => {
        setIsLoading(true);
        try {
            await fetch(`/notifications/${notificationId}/mark-as-read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId 
                        ? { ...notif, read: true }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Erreur lors du marquage de la notification:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAllAsRead = async () => {
        setIsLoading(true);
        try {
            await fetch('/notifications/mark-all-as-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            setNotifications(prev => 
                prev.map(notif => ({ ...notif, read: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Erreur lors du marquage de toutes les notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-3 border-b">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            onClick={markAllAsRead}
                            disabled={isLoading}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6"
                        >
                            <Check className="h-3 w-3 mr-1" />
                            Tout marquer comme lu
                        </Button>
                    )}
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            Aucune notification
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="p-3 cursor-pointer"
                                onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                                <div className="flex items-start space-x-3 w-full">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className={`text-xs font-medium truncate ${
                                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                                            }`}>
                                                {notification.title}
                                            </p>
                                            
                                            {!notification.read && (
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                                            )}
                                        </div>
                                        
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                                            {notification.message}
                                        </p>
                                        
                                        <p className="text-xs text-gray-400">
                                            {formatDistanceToNow(new Date(notification.created_at))}
                                        </p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                    <Link 
                        href="/notifications" 
                        className="flex items-center justify-center p-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Voir toutes les notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
