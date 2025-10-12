import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Tag, Percent, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

interface CouponFormProps {
    onCouponApplied?: (coupon: any) => void;
    montantTotal?: number;
    className?: string;
}

interface CouponData {
    id: number;
    code: string;
    type: 'fixe' | 'pourcentage';
    valeur: number;
    montant_minimum: number;
    montant_maximum?: number;
    date_fin: string;
    description?: string;
}

interface CouponResponse {
    valid: boolean;
    coupon?: CouponData;
    reduction?: number;
    message: string;
}

export default function CouponForm({ 
    onCouponApplied, 
    montantTotal = 0,
    className = "" 
}: CouponFormProps) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
    const [reduction, setReduction] = useState(0);

    const applyCoupon = async () => {
        if (!code.trim()) {
            toast.error('Veuillez saisir un code coupon');
            return;
        }

        if (montantTotal <= 0) {
            toast.error('Montant total insuffisant');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    code: code.trim(),
                    montant: montantTotal
                })
            });

            const data: CouponResponse = await response.json();

            if (data.valid && data.coupon) {
                setAppliedCoupon(data.coupon);
                setReduction(data.reduction || 0);
                toast.success(data.message);
                
                if (onCouponApplied) {
                    onCouponApplied({
                        ...data.coupon,
                        reduction: data.reduction
                    });
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Erreur lors de la validation du coupon');
        } finally {
            setLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setReduction(0);
        setCode('');
        
        if (onCouponApplied) {
            onCouponApplied(null);
        }
        
        toast.success('Coupon retiré');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getCouponIcon = (type: string) => {
        return type === 'pourcentage' ? 
            <Percent className="h-4 w-4" /> : 
            <DollarSign className="h-4 w-4" />;
    };

    const getCouponDescription = (coupon: CouponData) => {
        if (coupon.type === 'pourcentage') {
            return `${coupon.valeur}% de réduction`;
        } else {
            return `${coupon.valeur}€ de réduction`;
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Code promo
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!appliedCoupon ? (
                    <>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Entrez votre code promo"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                                className="flex-1"
                            />
                            <Button 
                                onClick={applyCoupon}
                                disabled={loading || !code.trim()}
                                className="px-6"
                            >
                                {loading ? 'Validation...' : 'Appliquer'}
                            </Button>
                        </div>
                        
                        {montantTotal > 0 && (
                            <p className="text-sm text-gray-500">
                                Montant total: {montantTotal.toFixed(2)}€
                            </p>
                        )}
                    </>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        {getCouponIcon(appliedCoupon.type)}
                                        <span className="font-medium text-green-800">
                                            {appliedCoupon.code}
                                        </span>
                                    </div>
                                    <p className="text-sm text-green-600">
                                        {getCouponDescription(appliedCoupon)}
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={removeCoupon}
                                className="text-red-600 hover:text-red-700"
                            >
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Réduction appliquée:</span>
                                <span className="font-medium text-green-600">
                                    -{reduction.toFixed(2)}€
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Nouveau total:</span>
                                <span className="font-medium">
                                    {(montantTotal - reduction).toFixed(2)}€
                                </span>
                            </div>
                        </div>

                        {appliedCoupon.description && (
                            <p className="text-xs text-gray-500">
                                {appliedCoupon.description}
                            </p>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Valide jusqu'au:</span>
                            <Badge variant="outline">
                                {formatDate(appliedCoupon.date_fin)}
                            </Badge>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}