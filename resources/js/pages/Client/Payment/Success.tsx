import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';

interface Props {
    order_id: string;
    commande_id: number;
}

export default function PayPalSuccess({ order_id, commande_id }: Props) {
    const [status, setStatus] = useState('processing'); // processing, success, error
    const [message, setMessage] = useState('Finalisation de votre paiement, veuillez patienter...');

    useEffect(() => {
        const capturePayment = async () => {
            try {
                const response = await fetch(`/payment/paypal/capture/${commande_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ order_id }),
                });

                const data = await response.json();

                if (data.success) {
                    setStatus('success');
                    setMessage('Paiement réussi ! Votre commande est confirmée.');
                    toast.success("Merci, votre commande a bien été reçue ! Vous recevrez bientôt une confirmation.");
                    
                    setTimeout(() => {
                        router.visit('/');
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Une erreur est survenue lors de la finalisation du paiement.');
                    toast.error(data.message || 'Une erreur est survenue lors de la finalisation du paiement.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Une erreur de communication est survenue. Veuillez contacter le support.');
                toast.error('Une erreur de communication est survenue. Veuillez contacter le support.');
            }
        };

        capturePayment();
    }, [order_id, commande_id]);

    return (
        <>
            <ToastContainer position="top-right" theme="colored" />
            <Head title="Statut du Paiement" />
            <div className="max-w-2xl mx-auto p-6 mt-10">
                <Card>
                    <CardContent className="text-center py-12">
                        {status === 'processing' && (
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Check className="h-8 w-8 text-green-600" />
                            </div>
                        )}
                         {status === 'error' && (
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <Check className="h-8 w-8 text-red-600" />
                            </div>
                        )}
                        
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {status === 'processing' && 'Traitement en cours'}
                            {status === 'success' && 'Paiement réussi !'}
                            {status === 'error' && 'Échec du paiement'}
                        </h2>
                        <p className="text-gray-600">
                            {message}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}