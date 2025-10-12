// Fonction route globale pour Laravel
declare global {
    function route(name: string, params?: any): string;
}

export function route(name: string, params?: any): string {
    if (typeof window !== 'undefined' && (window as any).route) {
        return (window as any).route(name, params);
    }
    
    // Fallback pour le développement
    const routes: Record<string, string> = {
        'home': '/',
        'dashboard': '/dashboard',
        'login': '/login',
        'register': '/register',
        'password.update': '/password',
        'password.edit': '/password/edit',
        'password.request': '/forgot-password',
        'profile.destroy': '/profile',
        'settings.appearance.update': '/settings/appearance',
        'two-factor.show': '/two-factor',
        'two-factor.enable': '/two-factor/enable',
        'two-factor.disable': '/two-factor/disable',
        'two-factor.confirm': '/two-factor/confirm',
        'two-factor.qr-code': '/two-factor/qr-code',
        'two-factor.secret-key': '/two-factor/secret-key',
        'two-factor.recovery-codes': '/two-factor/recovery-codes',
        'two-factor.regenerate-recovery-codes': '/two-factor/recovery-codes/regenerate',
    };
    
    return routes[name] || `/${name}`;
}

