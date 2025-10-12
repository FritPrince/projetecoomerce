// components/popular-products.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
    id: number;
    name: string;
    price: number;
    favoris_count: number;
}

interface PopularProductsProps {
    products: Product[];
}

export function PopularProducts({ products }: PopularProductsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Produits Populaires</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-medium">{product.name}</span>
                                <span className="text-sm text-muted-foreground">
                                    {product.favoris_count} favoris
                                </span>
                            </div>
                            <span className="font-medium">{product.price} €</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}