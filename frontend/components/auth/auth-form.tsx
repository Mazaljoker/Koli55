'use client';

import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase/client';

const AuthForm = () => {
  return (
    <div>
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
      />
    </div>
  );
};

export default AuthForm; 