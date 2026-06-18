export function generatePitchPreview({ name, company, designation, city, property, goal }) {
  const ticketId = `TMAX-VIP-${Math.floor(1000 + Math.random() * 9000)}`;
  const primaryGoal = goal || "building high-value partnerships and exchanging industry best practices";
  const selectedCity = city || "All Major Indian Hubs";
  const selectedProperty = property || "TalentMax Meet-Up";

  return {
    inviteLetter: `Dear ${name},\n\nOn behalf of the TalentMax Organizing Committee, we are pleased to extend a formal VIP invitation to you as ${designation} at ${company}. Your preferred focus on ${selectedCity} and ${selectedProperty} aligns strongly with our executive networking format.\n\nWarm regards,\nTalentMax Organizing Committee`,
    strategicMatch: `${selectedProperty} is designed to place ${company} in front of high-intent HR leaders, business decision-makers, technology partners, and growth-focused operators. Your goal of "${primaryGoal}" fits naturally into the curated roundtable and VIP networking model.`,
    recommendedCohorts: [
      "CHROs and senior HR transformation leaders",
      "Talent acquisition heads and employer branding experts",
      "Enterprise SaaS founders, consultants, and sponsor partners"
    ],
    customPitch: `Hello,\n\nI am ${name}, ${designation} at ${company}. I am attending the TalentMax Meet-Up in ${selectedCity} to connect with progressive leaders around ${primaryGoal}.\n\nI would be glad to exchange perspectives during the VIP networking sessions.\n\nBest regards,\n${name}`,
    vipBadgeCode: ticketId
  };
}
