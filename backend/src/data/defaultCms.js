export const defaultRoadshow = {
  title: "HR Connect India 2026: The Mega Pan-India Roadshow",
  description:
    "Join our most ambitious initiative yet. A synchronized series of networking summits across India's premier industrial hubs, reaching over 1,500+ HR Leaders in a single month. Securing VIP seats aligns you with regional pioneers.",
  ctaLabel: "Reserve Your City Slot Now",
  metrics: [
    { value: "12", label: "Strategic Cities Loaded" },
    { value: "1,500+", label: "HR Leaders Targeted" },
    { value: "30+", label: "Sponsor Brands Partnered" }
  ]
};

export const defaultEvents = [
  {
    slug: "hr-meetup",
    title: "HR Meet-Up",
    subtitle: "Exclusive local networking for HR managers.",
    badge: "CORE EVENT",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARwfKnE7qNSMnWGzm_reEgg-r6bNejgW23vuIEXGb4ph0f9q9x__Kj7noTPcOHTn8KlpVAGS-5IRN4ZzVFd2ATWyGS41T3b7NtV5JcjJGKvDSpFjNsbmmsv7R6FsVLEcfmsvLY_DR2HjWpLezoB_pRg3lDNjEer57nYeXQHUjqMvKJpjnsag-AIaT8MrDgzFe01kkbun7cjjj8PWSuimPmewger4Pr4TkinpJEo12a5vkR-_QkAdR0C0nssj6IhL65rEMmweg2Ml4",
    details: [
      "Targeted focus on operational excellence.",
      "Peer-to-peer breakout workshops.",
      "In-depth discussions on local labor laws and compliance.",
      "VIP networking lunches with regional directors."
    ],
    sortOrder: 1
  },
  {
    slug: "chro-summit",
    title: "CHRO Leadership Summit",
    subtitle: "Strategic vision for C-suite human capital leaders.",
    badge: "PREMIUM",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVapJcljWd4dCX5o-1g0_k-dAw6-gmO1v-Z50lVX8TqoQ0kBZ7J911mqiBGn3ACaT8JhJDcvYlpLrl5PkKXijtNs0WEsTmJyVDX04ybhIKRELMC_r_yDA4HWi_cmibF4kZ5ZMwB6uH17iOm2BTY2bj5-5gjGoALYjHbHzYNXhhAMFAKSk7DOOU8m6sK_mui_d8IejfEMbcH46xP_tFbRRZj8dwWNt0J61k9AeLF_2-LDlSSeS4JihNAgGocTMkhp6WYiQbsYRd9TQ",
    details: [
      "C-Suite exclusive attendance (subject to screening).",
      "Roundtables on remote workspaces & global expansion.",
      "Executive compensation and boardroom alignment strategy.",
      "Access to the premium digital matchmaking board."
    ],
    sortOrder: 2
  },
  {
    slug: "hr-conclave",
    title: "HR Conclave",
    subtitle: "Deep-dive technical sessions and panel discussions.",
    badge: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuACFLHuVLWSaV7ugOwHh7PFYPdCiV_xCf4HbwVUSULJ8yHBD2zAvXCn34sRy22TAdwjEz7uJiFjfJonbpkSc2rN2ENflh5MmSjny7FYOu-66ysAXU5jNgivhBMwaxRDa9qaAThfov4SI2ihTUCRMIgOMb6xh7kgh8gGJ0vB5aROUNG2rP94jNVI4Gv1aALVnIhrvjy9nmQJF7zGZ4et2CMxhb6oG_A1SL0uP9MWxH2ge247yfF2EIhCJ0uJgbUvAgiz578a1B6gn0A",
    details: [
      "Keynote addresses from global HR strategists.",
      "Panels evaluating upcoming HR platform products and stack integrations.",
      "Large scale networking hall with tea & high coffee sessions.",
      "Live polling and white paper launches."
    ],
    sortOrder: 3
  },
  {
    slug: "job-fair",
    title: "TalentMax Job Fair",
    subtitle: "Connecting top-tier talent with ambitious companies.",
    badge: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAelbO-qA0QKknBmH4RSSTnd81EUEHeMknhZ59bxt6K0mL3WMYfrsM7b6-28ZhX6GdLyLL4XyGFwskEwl539f-Yz-gwrFpPe1uCGt0BkUUSsMHemW17YCSQPo-_FB-5s6fe73iPCH8DhPAzUNE1_yHcJ-tqFfIBqeVLsinD9bP1DHCavVfvTxhAyYw1X54LTBH9ik45Dkb7KHsTSCwFgpSph47lI6PK3Bpe00WFm853wcgrS2Rlsj3--tIfD3ewf4jytsO0PYLww88",
    details: [
      "Instant interview setups and real-time screening.",
      "Employer-branding stalls with full digital presentation.",
      "Over 1,000+ top-tier graduates and professional candidates.",
      "Direct resume-upload database shared with gold sponsors."
    ],
    sortOrder: 4
  }
];

const cityNames = [
  "Indore",
  "Bhopal",
  "Jaipur",
  "Ahmedabad",
  "Pune",
  "Mumbai",
  "Delhi NCR",
  "Chandigarh",
  "Hyderabad",
  "Bengaluru",
  "Chennai",
  "Kolkata"
];

export const defaultCities = cityNames.map((name, index) => ({
  name,
  landmark: name,
  historicalEra: "Historical Enterprise Hub",
  image: "",
  historicalInsight: `${name} is part of the TalentMax roadshow network for high-value HR and business networking.`,
  networkingVibe: "A strategic business destination for HR leaders, sponsors, consultants, and enterprise partners.",
  sortOrder: index + 1
}));
