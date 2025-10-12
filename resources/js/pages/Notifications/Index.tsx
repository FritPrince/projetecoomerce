import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Check, Trash2, Clock, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
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
    read_at: string | null;
    created_at: string;
}

interface Props {
    notifications: {
        data: Notification[];
        links: any[];
        meta: any;
    };
    unreadCount: number;
}

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'nouvelle_commande':
            return <ShoppingCart className="h-5 w-5 text-blue-500" />;
        case 'stock_faible':
            return <AlertTriangle className="h-5 w-5 text-orange-500" />;
        case 'statut_commande_modifie':
            return <Package className="h-5 w-5 text-green-500" />;
        default:
            return <Bell className="h-5 w-5 text-gray-500" />;
    }
};

const getNotificationColor = (type: string) => {
    switch (type) {
        case 'nouvelle_commande':
            return 'bg-blue-50 border-blue-200';
        case 'stock_faible':
            return 'bg-orange-50 border-orange-200';
        case 'statut_commande_modifie':
            return 'bg-green-50 border-green-200';
        default:
            return 'bg-gray-50 border-gray-200';
    }
};

export default function NotificationsIndex({ notifications, unreadCount }: Props) {
    const [localNotifications, setLocalNotifications] = useState(notifications.data);
    const [isLoading, setIsLoading] = useState(false);

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

            setLocalNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId 
                        ? { ...notif, read: true, read_at: new Date().toISOString() }
                        : notif
                )
            );
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

            setLocalNotifications(prev => 
                prev.map(notif => ({ 
                    ...notif, 
                    read: true, 
                    read_at: new Date().toISOString() 
                }))
            );
        } catch (error) {
            console.error('Erreur lors du marquage de toutes les notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNotification = async (notificationId: number) => {
        setIsLoading(true);
        try {
            await fetch(`/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            setLocalNotifications(prev => 
                prev.filter(notif => notif.id !== notificationId)
            );
        } catch (error) {
            console.error('Erreur lors de la suppression de la notification:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Notifications" />
            
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-600 mt-1">
                            Gérez vos notifications et restez informé de l'activité
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-sm">
                                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                            </Badge>
                        )}
                        
                        {unreadCount > 0 && (
                            <Button 
                                onClick={markAllAsRead}
                                disabled={isLoading}
                                variant="outline"
                                size="sm"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Tout marquer comme lu
                            </Button>
                        )}
                    </div>
                </div>

                {localNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Bell className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Aucune notification
                            </h3>
                            <p className="text-gray-500 text-center">
                                Vous n'avez pas encore de notifications. Elles apparaîtront ici 
                                quand il y aura de l'activité à signaler.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {localNotifications.map((notification) => (
                            <Card 
                                key={notification.id}
                                className={`transition-all duration-200 hover:shadow-md ${
                                    !notification.read ? 'ring-2 ring-blue-200' : ''
                                } ${getNotificationColor(notification.type)}`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`text-sm font-medium ${
                                                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                        {notification.title}
                                                    </h3>
                                                    
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </div>
                                                
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {notification.message}
                                                </p>
                                                
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {formatDistanceToNow(new Date(notification.created_at))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 ml-4">
                                            {!notification.read && (
                                                <Button
                                                    onClick={() => markAsRead(notification.id)}
                                                    disabled={isLoading}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            
                                            <Button
                                                onClick={() => deleteNotification(notification.id)}
                                                disabled={isLoading}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
