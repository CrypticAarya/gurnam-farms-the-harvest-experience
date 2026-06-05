import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { N as Navbar } from "./Navbar-DWTZYOKE.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as BUSINESS } from "./config-C8u_ZaCx.mjs";
import { u as useScroll, a as useTransform, m as motion } from "../_libs/framer-motion.mjs";
import { M as MapPin, C as Calendar, T as Truck, L as Leaf, I as Instagram, F as Facebook, a as Twitter } from "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const heroFarm = "/assets/hero-farm-BMu-9kUs.jpg";
const badges = [];
function Hero() {
  const ref = reactExports.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      ref,
      id: "top",
      className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-deep",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { style: { y }, className: "absolute inset-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: heroFarm,
              alt: "Organic farm at dawn with rows of fresh green crops",
              width: 1920,
              height: 1280,
              className: "h-full w-full origin-center scale-110 animate-kenburns object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/40 to-forest-deep/90" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-transparent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            style: { opacity },
            className: "relative z-10 mx-auto max-w-4xl px-6 pt-24 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.8, delay: 0.4 },
                  className: "eyebrow text-gold",
                  children: "Farm-to-Home · Established in Patiala"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.h1,
                {
                  initial: { opacity: 0, y: 30 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] },
                  className: "mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight text-cream sm:text-6xl md:text-7xl lg:text-8xl text-balance",
                  children: [
                    "Organic Vegetables.",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-gold", children: "Straight from" }),
                    " Our Farms."
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.9, delay: 0.8 },
                  className: "mx-auto mt-7 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg",
                  children: "Delivered Weekly at your doorstep."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.9, delay: 0.95 },
                  className: "mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: "#cta",
                      className: "w-full rounded-full bg-gold px-9 py-4 text-sm font-semibold tracking-wide text-forest-deep transition-transform hover:scale-[1.03] sm:w-auto",
                      children: "Reserve Your Share"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.ul,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: 1, delay: 1.2 },
                  className: "mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3",
                  children: badges.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream/70",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(b.icon, { size: 16, className: "text-gold" }),
                        b.label
                      ]
                    },
                    b.label
                  ))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            style: { opacity },
            className: "absolute bottom-8 left-1/2 z-10 -translate-x-1/2",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-7 items-start justify-center rounded-full border border-cream/30 p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-1 animate-scroll-cue rounded-full bg-gold" }) })
          }
        )
      ]
    }
  );
}
const variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};
function Reveal({
  children,
  delay = 0,
  className,
  as = "div"
}) {
  const MotionTag = motion[as];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MotionTag,
    {
      className,
      variants,
      initial: "hidden",
      whileInView: "show",
      viewport: { once: true, amount: 0.25 },
      transition: { delay },
      children
    }
  );
}
const storyFarm = "/assets/story-farm-1ZP40O1H.jpg";
const stats = [
  { value: 30, suffix: "k/Season", label: "For 200 sq.ft." }
];
function Stat({ value, suffix, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-4xl font-medium text-forest md:text-5xl", children: [
      value,
      suffix
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm uppercase tracking-widest text-muted-foreground", children: label })
  ] });
}
function Story() {
  const ref = reactExports.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "story", className: "relative bg-cream bg-grain py-24 md:py-36", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { className: "order-2 lg:order-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow text-gold", children: "What we do" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance", children: [
        "From Our Fields,",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-gold", children: "Grown" }),
        " for You."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "At Gurnam farms, you can book a 200sq.ft. yard for your organic vegetables for summer/winter season. which will be delivered at your doorstep weekly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Winter Season: October to February (bookings open in August and September)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Summer Season: April to August (bookings open in February and March)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-10 sm:grid-cols-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { ...s }, s.label)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { className: "order-1 lg:order-2", delay: 0.15, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref,
        className: "relative aspect-[4/5] overflow-hidden rounded-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.img,
            {
              style: { y },
              src: storyFarm,
              alt: "Farmer holding freshly harvested organic vegetables",
              width: 1080,
              height: 1600,
              loading: "lazy",
              className: "absolute inset-0 h-[116%] w-full object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 ring-1 ring-inset ring-forest/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-5 left-5 right-5 rounded-sm border border-cream/20 bg-forest-deep/80 px-6 py-5 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg italic text-cream", children: '"From our hands to your home — nothing in between."' }) })
        ]
      }
    ) })
  ] }) });
}
const seasons = [
  {
    title: "Winter Harvest",
    vegetables: [
      "Cauliflower (Phool Gobi)",
      "Cabbage (Band Gobi)",
      "Iceberg Lettuce (Salad Gobi)",
      "Broccoli",
      "Carrot (Gajar)",
      "Radish (Muli)",
      "Beetroot (Chukandar)",
      "Turnip (Shalgam)",
      "Tomato",
      "Cherry Tomato",
      "Spinach (Palak)",
      "Fenugreek (Methi)",
      "Bathua",
      "Onion (Pyaz)",
      "Garlic (Lehsun)"
    ]
  },
  {
    title: "Summer Harvest",
    vegetables: [
      "Bottle Gourd (Lauki/Ghiya)",
      "Zucchini",
      "Bitter Gourd (Karela)",
      "Sponge Gourd (Tori)",
      "Round Gourd (Tinda)",
      "Summer Squash (Chappan Kaddu)",
      "Pumpkin (Petha)",
      "Lady Finger (Bhindi)",
      "Arbi",
      "Tomato",
      "Cherry Tomato",
      "Capsicum (Shimla Mirch)",
      "Bell Peppers (Red & Yellow Capsicum)",
      "Cucumber (Kheera)",
      "English Cucumber",
      "Eggplant (Baingan)",
      "Green Chilli (Hari Mirch)",
      "Beans (Lobia)",
      "Watermelon (Tarbooj)"
    ]
  }
];
function SeasonalHarvest() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "seasonal", className: "bg-cream bg-grain py-24 md:py-36", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow text-gold", children: "What's Growing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance", children: "Seasonal Harvest" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-base leading-relaxed text-muted-foreground md:text-lg", children: "Our weekly harvest boxes feature seasonal vegetables at their peak ripeness, grown without chemicals or synthetic inputs." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 grid gap-12 lg:grid-cols-2", children: seasons.map((season, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: i * 0.15, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-forest-deep/10 bg-white/60 p-8 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-medium text-forest-deep md:text-3xl", children: season.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3", children: season.vegetables.map((veg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.li,
        {
          initial: { opacity: 0, y: 8 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5 },
          className: "flex items-center gap-3 text-sm font-medium text-forest-deep",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-gold" }),
            veg
          ]
        },
        veg
      )) })
    ] }) }, season.title)) })
  ] }) });
}
const areas = [
  {
    name: "Patiala",
    description: "Our home. Fresh harvests delivered weekly."
  },
  {
    name: "Rajpura",
    description: "Premium produce, same-day delivery available."
  },
  {
    name: "Ambala",
    description: "Extended delivery network for quality assurance."
  },
  {
    name: "Chandigarh",
    description: "Capital region deliveries with care."
  }
];
function DeliveryAreas() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-white py-24 md:py-36", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow text-gold", children: "Service Areas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance", children: "Delivery Across Four Cities" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg", children: "Fresh seasonal harvests grown at our Patiala farm and delivered weekly across Patiala, Rajpura, Ambala and Chandigarh." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-4", children: areas.map((area, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: index * 0.1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-cream/50 to-white p-8 transition-all hover:border-gold/40 hover:shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-12 w-12 rounded-full bg-gold/10 text-gold transition-all group-hover:bg-gold group-hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-medium text-forest", children: area.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: area.description })
      ] })
    ] }) }, area.name)) })
  ] }) });
}
const farmInfo = [
  {
    label: "Farm Location",
    value: "Patiala, Punjab",
    icon: MapPin
  },
  {
    label: "Harvest Schedule",
    value: "Weekly Harvests",
    icon: Calendar
  },
  {
    label: "Delivery Area",
    value: "Patiala Only",
    icon: Truck
  }
];
function DeliveryNetwork() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "delivery", className: "bg-cream bg-grain py-24 md:py-36", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Reveal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow text-gold", children: "Our Farm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance", children: "Visit Our Farm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-base leading-relaxed text-muted-foreground md:text-lg", children: "Fresh seasonal harvests grown at our Patiala farm and delivered weekly across Patiala, Rajpura, Ambala and Chandigarh. Experience where your food comes from — sourced with care, harvested with precision." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-3 rounded-lg border border-gold/20 bg-gold/5 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow text-gold", children: "Farm Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-forest", children: [
          "Gurnam Farms",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Patiala, Punjab"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3 rounded-lg border border-gold/20 bg-gold/5 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow text-gold", children: "Weekly Harvest Schedule" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Fresh harvests picked every week, delivered before dawn to your doorstep in Patiala." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col gap-4 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            className: "bg-forest hover:bg-forest-deep text-cream",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://maps.app.goo.gl/q7jQ6uhSisg3hz5M6", target: "_blank", rel: "noopener noreferrer", children: "Get Directions" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "border-gold text-forest hover:bg-gold/10",
            onClick: () => navigate({ to: "/reserve" }),
            children: "Reserve Your Harvest"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid grid-cols-3 gap-4", children: farmInfo.map((info) => {
        const Icon = info.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border bg-white/50 p-4 text-center backdrop-blur",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "mx-auto h-5 w-5 text-gold" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs uppercase tracking-widest text-muted-foreground", children: info.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-semibold text-forest", children: info.value })
            ]
          },
          info.label
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Reveal, { delay: 0.15, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-square overflow-hidden rounded-2xl border-2 border-gold/20 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "iframe",
      {
        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.5844857963447!2d76.37840931542095!3d30.90876859999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391174f3c0a3c0a7%3A0x1234567890abcdef!2sGurnam%20Farms!5e0!3m2!1sen!2sin!4v1234567890",
        width: "100%",
        height: "100%",
        style: { border: 0 },
        allowFullScreen: true,
        loading: "lazy",
        referrerPolicy: "no-referrer-when-downgrade",
        className: "absolute inset-0"
      }
    ) }) })
  ] }) });
}
const columns = [
  // {
  //   title: "Company",
  //   links: ["Our Story", "Delivery Areas"],
  // },
  {
    title: "Support",
    links: ["Reserve", "Contact"]
  }
];
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-forest-deep text-cream", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-20 lg:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 lg:grid-cols-[1.5fr_2fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/", className: "flex items-baseline gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl", children: BUSINESS.name.split(" ")[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow text-gold", children: BUSINESS.name.split(" ").slice(1).join(" ") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-sm text-sm leading-relaxed text-cream/70", children: "Organic Vegetables Harvested and delivered at your door-step." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-8", children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow text-cream/50", children: col.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 space-y-3", children: col.links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: link === "Reserve" ? "/reserve" : link === "Contact" ? "/contact" : `tel:${BUSINESS.phone}`,
            className: "text-sm text-cream/75 transition-colors hover:text-gold",
            children: link
          }
        ) }, link)) })
      ] }, col.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 flex flex-col items-center justify-between gap-5 border-t border-cream/10 pt-8 sm:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-xs text-cream/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { size: 14, className: "text-gold" }),
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " ",
        " ",
        BUSINESS.name,
        ". Grown with care in ",
        BUSINESS.address,
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: [Instagram, Facebook, Twitter].map((Icon, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "#",
          "aria-label": "Social link",
          className: "flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-gold hover:text-gold",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 17 })
        },
        i
      )) })
    ] })
  ] }) });
}
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cream", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Story, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SeasonalHarvest, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DeliveryAreas, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DeliveryNetwork, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  Index as component
};
