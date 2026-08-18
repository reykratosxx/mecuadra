import type { CategoryId, Condition } from "./types";

export const CATEGORIES: {
  id: CategoryId;
  label: string;
  hint: string;
}[] = [
  { id: "alimentos", label: "Alimentos", hint: "Arroz, aceite, leche, cárnicos" },
  { id: "aseo", label: "Aseo", hint: "Detergente, jabón, papel sanitario" },
  { id: "cuidado", label: "Cuidado personal", hint: "Shampoo, crema, desodorante" },
  { id: "medicamentos", label: "Medicamentos", hint: "Solo trueque, nunca venta" },
  { id: "bebidas", label: "Bebidas", hint: "Refresco, malta, café" },
  { id: "tabaco", label: "Tabaco", hint: "Cigarros criollos y de bodega" },
  { id: "ropa", label: "Ropa", hint: "Adultos, niños, calzado" },
  { id: "hogar", label: "Hogar", hint: "Utensilios, limpieza, menaje" },
  { id: "ninos", label: "Niños y bebé", hint: "Ropa, compotas, útiles" },
  { id: "otros", label: "Otros", hint: "Lo que no encaja arriba" },
];

export const CONDITIONS: { id: Condition; label: string }[] = [
  { id: "nuevo", label: "Nuevo" },
  { id: "usado", label: "Usado" },
  { id: "sellado", label: "Sellado" },
];

export function categoryLabel(id: CategoryId | "abierto") {
  if (id === "abierto") return "Escucho propuestas";
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
