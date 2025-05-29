import { NextResponse } from 'next/server';

// POST /api/avatar/config
// Sauvegarde la configuration de l'avatar pour l'utilisateur (simulation)
export async function POST(request: Request) {
  try {
    const avatarConfig = await request.json();

    // TODO: Valider les données reçues (avatarConfig)
    // Exemple de validation simple (à étoffer selon les besoins réels)
    if (!avatarConfig || typeof avatarConfig.backgroundColorKey !== 'string' || typeof avatarConfig.size !== 'number') {
      return NextResponse.json({ message: 'Données de configuration invalides.' }, { status: 400 });
    }

    console.log('[API /api/avatar/config] Configuration reçue pour sauvegarde:', avatarConfig);

    // Ici, vous intégreriez la logique pour sauvegarder en base de données
    // Par exemple, avec Supabase:
    // const { data, error } = await supabase
    //   .from('user_profiles')
    //   .update({ avatar_config: avatarConfig })
    //   .eq('user_id', userId); // Il faudrait récupérer l'ID de l'utilisateur authentifié

    // if (error) {
    //   console.error('[API /api/avatar/config] Erreur Supabase:', error);
    //   return NextResponse.json({ message: 'Erreur lors de la sauvegarde de la configuration.', error: error.message }, { status: 500 });
    // }

    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        message: 'Configuration de l'avatar sauvegardée avec succès !',
        savedConfig: avatarConfig, // Renvoyer la configuration sauvegardée peut être utile
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /api/avatar/config] Erreur inattendue:', error);
    let errorMessage = 'Une erreur interne est survenue.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Erreur lors du traitement de la requête.', error: errorMessage }, { status: 500 });
  }
} 