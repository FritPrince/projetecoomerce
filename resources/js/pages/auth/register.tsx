// resources/js/Pages/Auth/Register.tsx
import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock, Phone, MapPin, ShoppingCart } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    return (
        <>
            <Head title="Créer un compte" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                EliteShop
                            </span>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
                        Créer votre compte
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                        Ou{' '}
                        <TextLink
                            href={login()}
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            connectez-vous à votre compte existant
                        </TextLink>
                    </p>
                </div>

                {/* Form */}
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-600">
                        <Form
                            {...RegisteredUserController.store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-6">
                                        {/* Nom complet */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                                                Nom complet
                                            </Label>
                                            <div className="relative">
                                                
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="name"
                                                    name="name"
                                                    placeholder="Votre nom complet"
                                                    className="pl-10 appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                                                Adresse email
                                            </Label>
                                            <div className="relative">
                                                
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="email"
                                                    name="email"
                                                    placeholder="email@example.com"
                                                    className="pl-10 appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Téléphone */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="telephone" className="text-slate-700 dark:text-slate-300">
                                                Téléphone
                                            </Label>
                                            <div className="relative">
                                               
                                                <Input
                                                    id="telephone"
                                                    type="tel"
                                                    tabIndex={3}
                                                    autoComplete="tel"
                                                    name="telephone"
                                                    placeholder="+33 1 23 45 67 89"
                                                    className="pl-10 appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                                />
                                            </div>
                                            <InputError message={errors.telephone} />
                                        </div>

                                        {/* Adresse */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="adresse" className="text-slate-700 dark:text-slate-300">
                                                Adresse
                                            </Label>
                                            <div className="relative">
                                        
                                                <Input
                                                    id="adresse"
                                                    type="text"
                                                    tabIndex={4}
                                                    autoComplete="street-address"
                                                    name="adresse"
                                                    placeholder="Votre adresse complète"
                                                    className="pl-10 appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                                />
                                            </div>
                                            <InputError message={errors.adresse} />
                                        </div>

                                        {/* Mot de passe */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                                                Mot de passe
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    required
                                                    tabIndex={5}
                                                    autoComplete="new-password"
                                                    name="password"
                                                    placeholder="Votre mot de passe"
                                                    className="pl-10 appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                                />
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Confirmation mot de passe */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation" className="text-slate-700 dark:text-slate-300">
                                                Confirmer le mot de passe
                                            </Label>
                                            <div className="relative">
                                                
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    required
                                                    tabIndex={6}
                                                    autoComplete="new-password"
                                                    name="password_confirmation"
                                                    placeholder="Confirmer votre mot de passe"
                                                    className="pl-10 appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.password_confirmation}
                                            />
                                        </div>

                                        {/* Bouton d'inscription */}
                                        <Button
                                            type="submit"
                                            className="mt-2 w-full group relative flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                                            tabIndex={7}
                                            data-test="register-user-button"
                                        >
                                            {processing ? (
                                                <>
                                                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                                    Création du compte...
                                                </>
                                            ) : (
                                                'Créer mon compte'
                                            )}
                                        </Button>
                                    </div>

                                    {/* Lien vers connexion */}
                                    <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                                        Vous avez déjà un compte ?{' '}
                                        <TextLink 
                                            href={login()} 
                                            tabIndex={8}
                                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                        >
                                            Se connecter
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}