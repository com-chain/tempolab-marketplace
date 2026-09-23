// Taxonomía de categorías: describe el tipo de servicio ofrecido por la
// organización más que un tipo de producto físico.
export const categoryTree = [
  { name: "Administración", subs: [] },
  { name: "Mobiliario", subs: [] },
  { name: "Producción culinaria", subs: [] },
  { name: "Contabilidad", subs: [] },
  { name: "Recursos humanos", subs: [] },
  { name: "Voluntariado", subs: [] },
  { name: "Eventos", subs: [] },
  { name: "Comunicación", subs: [] },
  { name: "Relaciones públicas", subs: [] },
  { name: "Diseño gráfico", subs: [] },
  { name: "Proyectos", subs: [] },
  { name: "Financiación", subs: [] },
  { name: "Informática", subs: [] },
  { name: "Jurídico", subs: [] },
  { name: "Promoción artística y edición", subs: [] },
  { name: "Escritura y medios", subs: [] },
  { name: "Deportes y ocio", subs: [] },
  { name: "Salud y bienestar", subs: [] },
  { name: "Educación y formación", subs: [] },
];

export const categories = categoryTree.map((category) => category.name);
