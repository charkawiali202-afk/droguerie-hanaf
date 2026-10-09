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
  // Founder and story come from the shop's own "about" PDF (Oct 2026). It gives no phone, hours or address.
  founder: "Rachid Hanaf",
  hours: [
    // PLACEHOLDER: not found online, confirm with the shop. `days` are i18n keys, time null = closed.
    { days: "hours.monSat", time: "09:00 – 13:00 · 15:00 – 20:00" },
    { days: "hours.sun", time: null },
  ] as const,
  url: "https://droguerie-hanaf-beige.vercel.app",
};
export const ADDRESS = `${BUSINESS.street}, ${BUSINESS.district}, ${BUSINESS.city}`;
export const MAPS_QUERY = encodeURIComponent(`${BUSINESS.name}, ${ADDRESS}, Maroc`);
