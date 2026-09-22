// Taxonomie des catégories définie par Jean (remplace l'ancienne taxonomie
// inspirée de keepinuse.ch). Ces catégories décrivent le type de service
// rendu par l'association plutôt qu'un type de produit physique.
export const categoryTree = [
  { name: "Administration", subs: [] },
  { name: "Mobilier", subs: [] },
  { name: "Production culinaire", subs: [] },
  { name: "Comptabilité", subs: [] },
  { name: "Service de ressources humaines", subs: [] },
  { name: "Bénévolat", subs: [] },
  { name: "Événementiel", subs: [] },
  { name: "Communication", subs: [] },
  { name: "Relations publiques", subs: [] },
  { name: "Graphisme & design", subs: [] },
  { name: "Projets", subs: [] },
  { name: "Financement", subs: [] },
  { name: "IT", subs: [] },
  { name: "Juridique", subs: [] },
  { name: "Promotion artistique & édition", subs: [] },
  { name: "Écriture et média", subs: [] },
];

export const categories = categoryTree.map((category) => category.name);
