import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ticket, GitCompare, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
    {
        icon: Ticket,
        title: 'Découvrez les Coupons',
        description: 'Nous avons ajouté une section de coupons où vous pouvez trouver des réductions actives à utiliser lors de vos achats.',
    },
    {
        icon: GitCompare,
        title: 'Comparez vos Produits',
        description: 'Utilisez notre nouvel outil de comparaison pour voir les produits côte à côte et faire le meilleur choix.',
    },
    {
        icon: FileText,
        title: 'Gérez vos Commandes',
        description: 'Suivez facilement l\'état de vos commandes et consultez votre historique d\'achats dans votre espace personnel.',
    },
];

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = () => {
        router.post(route('onboarding.complete'), {}, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const { icon: Icon, title, description } = steps[currentStep];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
                    <DialogDescription className="mt-2 text-lg">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="my-6 flex justify-center space-x-2">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-8 rounded-full ${currentStep === index ? 'bg-primary' : 'bg-muted'}`}
                        />
                    ))}
                </div>

                <DialogFooter className="flex justify-between w-full">
                    {currentStep > 0 ? (
                        <Button variant="outline" onClick={handlePrevious}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Précédent
                        </Button>
                    ) : <div /> /* Placeholder to keep spacing */}

                    {currentStep < steps.length - 1 ? (
                        <Button onClick={handleNext}>
                            Suivant
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleFinish}>
                            Terminer
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
