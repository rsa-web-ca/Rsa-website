export interface Industry {
  name: string;
  detail?: string;
}

export const industries: Industry[] = [
  { name: "Automobile" },
  { name: "Chemicals" },
  {
    name: "Engineering",
    detail: "Civil Engineering & Construction, Domestic Appliances, EPC",
  },
  { name: "Entertainment" },
  { name: "Pharmaceuticals" },
  { name: "Retailers & Traders" },
  {
    name: "Services",
    detail:
      "Advertising, Information Technology, Architectural firms, land surveying firms & Professional Services",
  },
  { name: "Hospitals" },
  { name: "Medical Equipment Manufacturers" },
  { name: "Realtors" },
];
