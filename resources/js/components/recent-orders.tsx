// components/recent-orders.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
    id: number;
    reference: string;
    total: number;
    status: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
}

interface RecentOrdersProps {
    orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Commandes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-medium">#{order.reference}</span>
                                <span className="text-sm text-muted-foreground">
                                    {order.user.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{order.total} €</span>
                                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                    {order.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}