export type BreadcrumbItem = {
  path: string;
  title: string;
};

const breadcrumbNameMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/assistants": "Mes Assistants",
  "/dashboard/assistants/new": "Nouvel Assistant",
  "/dashboard/knowledge-bases": "Bases de Connaissances",
  "/dashboard/knowledge-bases/new": "Nouvelle Base",
  "/dashboard/phone-numbers": "Numéros de Téléphone",
  "/dashboard/usage-billing": "Usage & Facturation",
  "/dashboard/settings": "Paramètres",
  // Ajoutez d'autres ici au fur et à mesure
  // Pour les routes dynamiques, vous devrez les gérer spécifiquement
  // ex: '/dashboard/assistants/[id]': 'Détail Assistant' (le [id] sera remplacé)
};

export const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const pathSnippets = pathname.split("/").filter((i) => i);
  let breadcrumbs: BreadcrumbItem[] = [];

  if (pathname === "/dashboard") {
    breadcrumbs.push({ path: "/dashboard", title: "Dashboard" });
    return breadcrumbs;
  }

  // Toujours ajouter le Dashboard comme premier élément si ce n'est pas la page du dashboard elle-même
  breadcrumbs.push({ path: "/dashboard", title: "Dashboard" });

  pathSnippets.reduce((prevPath, currentPathSegment, index) => {
    const currentPath = `${prevPath}/${currentPathSegment}`;
    // Si nous sommes sur un segment dynamique, par exemple [id]
    if (
      currentPathSegment.startsWith("[") &&
      currentPathSegment.endsWith("]")
    ) {
      // Essayer de trouver un nom pour le parent, ex: /dashboard/assistants/[id] -> Mes Assistants
      const parentPath = pathSnippets.slice(0, index).join("/");
      const dynamicSegmentName =
        breadcrumbNameMap[`/dashboard/${parentPath}/[id]`] ||
        currentPathSegment;
      // Idéalement, ici on fetcherait le nom de l'entité (ex: nom de l'assistant)
      // Pour l'instant, on utilise un placeholder ou le nom du segment dynamique
      breadcrumbs.push({ path: currentPath, title: dynamicSegmentName });
    } else if (breadcrumbNameMap[currentPath]) {
      breadcrumbs.push({
        path: currentPath,
        title: breadcrumbNameMap[currentPath],
      });
    }
    return currentPath;
  }, ""); // Commence par une string vide pour le reduce, mais on utilise /dashboard comme base

  // Filtrer les doublons potentiels si la logique ci-dessus en crée
  breadcrumbs = breadcrumbs.filter(
    (crumb, index, self) =>
      index === self.findIndex((c) => c.path === crumb.path)
  );

  return breadcrumbs;
};
