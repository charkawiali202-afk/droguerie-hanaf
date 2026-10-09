// Real facts from the Telecontact.ma listing (checked Oct 2026). Items marked PLACEHOLDER were not found online.
export const BUSINESS = {
  name: "Droguerie Quincaillerie Hanaf",
  since: 1998,
  street: "53 rue Tarik Bnou Ziad",
  district: "Guéliz",
  city: "Marrakech",
  country: "MA",
  phone: "", // PLACEHOLDER: not found online, fill in before going live
  whatsapp: "", // PLACEHOLDER: international format without +, e.g. 2126XXXXXXXX
  hours: [
    // PLACEHOLDER: not found online, confirm with the shop
    { days: "Lundi – Samedi", time: "09:00 – 13:00 · 15:00 – 20:00" },
    { days: "Dimanche", time: "Fermé" },
  ],
  url: "https://example.com", // PLACEHOLDER: set to the real domain after deployment
};
export const ADDRESS = `${BUSINESS.street}, ${BUSINESS.district}, ${BUSINESS.city}`;
export const MAPS_QUERY = encodeURIComponent(`${BUSINESS.name}, ${ADDRESS}, Maroc`);
