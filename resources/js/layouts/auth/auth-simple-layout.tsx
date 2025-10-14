import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { ShoppingBag, Sparkles, Shield, Truck } from 'lucide-react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-svh bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Subtle Gradient Orbs */}
                <div 
                    className="absolute -top-20 -right-20 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl"
                    style={{ 
                        animation: 'pulse-subtle 6s ease-in-out infinite',
                        animationName: 'pulse-subtle'
                    } as React.CSSProperties}
                />
                <div 
                    className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-200/30 rounded-full blur-3xl"
                    style={{ 
                        animation: 'pulse-subtle 7s ease-in-out infinite 1s',
                        animationName: 'pulse-subtle'
                    } as React.CSSProperties}
                />
                
                {/* Geometric Patterns */}
                <div 
                    className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-blue-300/20 rounded-lg"
                    style={{ 
                        animation: 'float 12s ease-in-out infinite',
                        animationName: 'float'
                    } as React.CSSProperties}
                />
                <div 
                    className="absolute bottom-1/3 right-1/4 w-6 h-6 border-2 border-emerald-300/20 rounded-full"
                    style={{ 
                        animation: 'float 12s ease-in-out infinite 3s',
                        animationName: 'float'
                    } as React.CSSProperties}
                />
                <div 
                    className="absolute top-1/3 right-1/3 w-4 h-4 border-2 border-red-300/20 rotate-45"
                    style={{ 
                        animation: 'float 12s ease-in-out infinite 6s',
                        animationName: 'float'
                    } as React.CSSProperties}
                />
            </div>

            {/* Floating Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div 
                    className="absolute top-20 left-10 text-blue-300/20"
                    style={{ 
                        animation: 'float 12s ease-in-out infinite',
                        animationName: 'float'
                    } as React.CSSProperties}
                >
                    <Truck size={24} />
                </div>
                <div 
                    className="absolute bottom-20 right-10 text-emerald-300/20"
                    style={{ 
                        animation: 'float 12s ease-in-out infinite 4s',
                        animationName: 'float'
                    } as React.CSSProperties}
                >
                    <Shield size={24} />
                </div>
                <div 
                    className="absolute top-40 right-20 text-red-300/20"
                    style={{ 
                        animation: 'float 12s ease-in-out infinite 2s',
                        animationName: 'float'
                    } as React.CSSProperties}
                >
                    <Sparkles size={20} />
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex min-h-svh items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Main Card */}
                    <div 
                        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-500 hover:shadow-2xl hover:border-blue-100 relative overflow-hidden"
                        style={{ 
                            animation: 'slide-up 0.8s ease-out 0.2s both',
                            animationName: 'slide-up'
                        } as React.CSSProperties}
                    >
                        {/* Shimmer Effect */}
                        <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                animation: 'shimmer 2s infinite',
                                animationName: 'shimmer'
                            } as React.CSSProperties}
                        />
                        
                        {/* Header */}
                        <div className="flex flex-col items-center gap-6 mb-8 relative z-10">
                            <Link
                                href={home()}
                                className="group flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105"
                            >
                                {/* Logo E-commerce */}
                                <div className="relative">
                                    <div className="p-4 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:from-blue-700 group-hover:to-emerald-700">
                                        <ShoppingBag className="h-8 w-8 text-white" />
                                    </div>
                                    {/* Active Ring */}
                                    <div 
                                        className="absolute inset-0 rounded-2xl border-2 border-blue-400/50 opacity-0"
                                        style={{
                                            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                                            animationName: 'ping'
                                        } as React.CSSProperties}
                                    />
                                </div>
                                
                                {/* Brand Name */}
                                <div className="text-center">
                                    <div 
                                        className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-emerald-600 to-red-600 bg-clip-text text-transparent"
                                        style={{ 
                                            backgroundSize: '200% 200%',
                                            animation: 'gradient-shift 3s ease infinite',
                                            animationName: 'gradient-shift'
                                        } as React.CSSProperties}
                                    >
                                        ShopStyle
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium mt-1">
                                        BOUTIQUE PREMIUM
                                    </div>
                                </div>
                            </Link>

                            {/* Title Section */}
                            <div className="text-center space-y-3">
                                <h1 
                                    className="text-2xl font-bold text-gray-900"
                                    style={{ 
                                        animation: 'slide-up 0.8s ease-out 0.4s both',
                                        animationName: 'slide-up'
                                    } as React.CSSProperties}
                                >
                                    {title}
                                </h1>
                                <p 
                                    className="text-sm text-gray-600 leading-relaxed"
                                    style={{ 
                                        animation: 'slide-up 0.8s ease-out 0.5s both',
                                        animationName: 'slide-up'
                                    } as React.CSSProperties}
                                >
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Children Content */}
                        <div 
                            className="space-y-6 relative z-10"
                            style={{ 
                                animation: 'slide-up 0.8s ease-out 0.6s both',
                                animationName: 'slide-up'
                            } as React.CSSProperties}
                        >
                            {children}
                        </div>

                        {/* Security Badge */}
                        <div 
                            className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2"
                            style={{ 
                                animation: 'slide-up 0.8s ease-out 0.8s both',
                                animationName: 'slide-up'
                            } as React.CSSProperties}
                        >
                            <Shield className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs text-gray-500">Transaction 100% sécurisée</span>
                        </div>
                    </div>

                    {/* Additional Links */}
                    <div 
                        className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100 transition-all duration-500 hover:bg-white hover:shadow-lg"
                        style={{ 
                            animation: 'slide-up 0.8s ease-out 1s both',
                            animationName: 'slide-up'
                        } as React.CSSProperties}
                    >
                        <p className="text-sm text-gray-600">
                            Nouveau client ?{' '}
                            <Link 
                                href="/register" 
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 hover:underline underline-offset-4"
                            >
                                Créer un compte
                            </Link>
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div 
                        className="mt-6 grid grid-cols-3 gap-4 text-center"
                        style={{ 
                            animation: 'slide-up 0.8s ease-out 1.1s both',
                            animationName: 'slide-up'
                        } as React.CSSProperties}
                    >
                        <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100">
                            <Truck className="h-4 w-4 text-blue-600" />
                            <span className="text-xs text-gray-600">Livraison rapide</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100">
                            <Shield className="h-4 w-4 text-emerald-600" />
                            <span className="text-xs text-gray-600">Paiement sécurisé</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100">
                            <Sparkles className="h-4 w-4 text-red-600" />
                            <span className="text-xs text-gray-600">Qualité premium</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations dans une balise style */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.02); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes ping {
                    75%, 100% { transform: scale(2); opacity: 0; }
                }
            `}</style>
        </div>
    );
}