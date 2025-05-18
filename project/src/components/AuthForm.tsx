import React, { useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

const AuthForm = React.memo(() => {
  const [error, setError] = useState<string | null>(null);

  // Handle auth state changes to clear errors when views change
  const handleViewChange = () => {
    setError(null);
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#435175',
                brandAccent: '#5b6a91',
              },
            },
          },
          style: {
            button: {
              borderRadius: '8px',
              padding: '10px 15px',
            },
            input: {
              borderRadius: '8px',
              padding: '10px 15px',
            },
          },
        }}
        providers={[]}
        view="sign_in"
        showLinks={true}
        onViewChange={handleViewChange}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Adresse email',
              password_label: 'Mot de passe',
              button_label: 'Se connecter',
              password_input_placeholder: 'Votre mot de passe',
              email_input_placeholder: 'exemple@domaine.com',
              link_text: 'Déjà un compte ? Connectez-vous',
              email_input_validation: 'Veuillez entrer une adresse email valide',
            },
            sign_up: {
              email_label: 'Adresse email',
              password_label: 'Mot de passe (minimum 6 caractères)',
              button_label: "S'inscrire",
              password_input_placeholder: 'Choisissez un mot de passe',
              email_input_placeholder: 'exemple@domaine.com',
              link_text: 'Pas encore de compte ? Inscrivez-vous',
              email_input_validation: 'Veuillez entrer une adresse email valide',
            },
            forgotten_password: {
              button_label: 'Envoyer les instructions',
              link_text: 'Mot de passe oublié ?',
              email_input_label: 'Adresse email',
              email_input_placeholder: 'Votre adresse email',
            },
          },
        }}
        callbacks={{
          async onAuthSuccess() {
            setError(null);
          },
          async onAuthFailure(error) {
            const errorMessage = error.message.toLowerCase();
            if (errorMessage.includes('invalid_credentials')) {
              setError('Identifiants invalides. Veuillez vérifier votre email et mot de passe.');
            } else if (errorMessage.includes('email_address_invalid') || errorMessage.includes('invalid_email')) {
              setError('Format d\'email invalide. Veuillez utiliser une adresse email valide (exemple: nom@domaine.com).');
            } else if (errorMessage.includes('weak_password')) {
              setError('Le mot de passe doit contenir au moins 6 caractères.');
            } else if (errorMessage.includes('email_taken')) {
              setError('Cette adresse email est déjà utilisée.');
            } else {
              setError('Une erreur est survenue. Veuillez réessayer.');
            }
          },
        }}
      />
    </div>
  );
});

AuthForm.displayName = 'AuthForm';

export default AuthForm;