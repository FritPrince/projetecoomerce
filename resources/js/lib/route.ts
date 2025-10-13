// Fonction route globale pour Laravel
declare global {
    function route(name: string, params?: any): string;
}

export function route(name: string, params?: any): string {
    if (typeof window !== 'undefined' && (window as any).route) {
        return (window as any).route(name, params);
    }

    console.error('Ziggy routes not found. Please run `php artisan ziggy:generate` and add `@routes` to your blade layout.');
    return '#';
}

