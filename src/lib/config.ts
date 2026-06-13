export const DELIVERY_AREAS = [
  "Patiala",
  "Rajpura",
  "Ambala",
  "Chandigarh",
];

export const DELIVERY_LOCATIONS = [
  "Model Town",
  "Urban Estate",
  "Tripuri",
  "Lower Mall",
  "Lehal Colony",
  "Rajpura Road",
  "Bhupindra Road",
  "New Lal Bagh",
  "Anardana Chowk",
  "21 No. Phatak",
];

export const BUSINESS = {
  name: "Gurnam Farms",
  phone: "9872863115",
  email: "info@gurnamfarms.example",
  address: "Punjab, India",
  social: {
    instagram: "",
    facebook: "",
    twitter: "",
  },
  deliveryAreas: DELIVERY_AREAS,
};

export const VEGETABLES = {
  winter: [
    "Cauliflower",
    "Carrot",
    "Mustard Greens",
    "Spinach",
    "Radish",
    "Turnip",
    "Peas",
    "Cabbage",
    "Broccoli",
    "Fenugreek",
    "Coriander",
    "Garlic",
    "Onion",
    "Potatoes",
    "Beetroot"
  ]
};

/**
 * Farm location config — update this single object to change the map across the site.
 */
export const FARM_LOCATION = {
  /** Short URL shared publicly (e.g. on WhatsApp, in emails). */
  shortUrl: "https://maps.app.goo.gl/q7jQ6uhSisg3hz5M6",
  /**
   * Google Maps Embed URL.
   * Generated from: Google Maps → Share → Embed a map → copy src value.
   * This embed uses the place query for Gurnam Farms, Poonian Jattan, Punjab.
   */
  embedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.3056320563!2d76.4194!3d30.8452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fd7003c80bac1%3A0x5374e7ff3a5633f7!2sKharoud%20House%20Bosar%2C%20Poonian%20Jattan%2C%20Punjab%20147103!5e0!3m2!1sen!2sin!4v1718003200000",
};
