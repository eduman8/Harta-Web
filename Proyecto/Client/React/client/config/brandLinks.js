const WHATSAPP_MESSAGE = "Hola, quiero hacer una consulta sobre un producto de #HARTA.";

export const BRAND_LINKS = {
  instagramBrand: "https://www.instagram.com/harta_bymale/",
  instagramOwner: "https://www.instagram.com/maleearballo/",
  whatsappPhone: "5493471566912",
  email: "mailto:malena.arballo1@gmail.com",
};

export const BRAND_WHATSAPP_URL = `https://wa.me/${BRAND_LINKS.whatsappPhone}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;
