export const getCharacterProfile = () => {
  return JSON.parse(localStorage.getItem("characterProfile")) || {};
};

export const getViewedGenres = () => {
  return JSON.parse(localStorage.getItem("viewedGenres")) || {};
};

export const getUserIdentity = () => {
  const profile = getCharacterProfile();

  const types = [
    { key: "op_mc", label: " Overpowered Strategist" },
    { key: "villain", label: " Dark Story Seeker" },
    { key: "romance", label: " Romance Reactor" },
    { key: "shy", label: " Quiet Observer" },
  ];

  let top = { label: " Casual Explorer", value: 0 };

  types.forEach((t) => {
    if ((profile[t.key] || 0) > top.value) {
      top = { label: t.label, value: profile[t.key] };
    }
  });

  return top.label;
};

export const getTasteDescription = () => {
  const profile = getCharacterProfile();

  let traits = [];

  if (profile.op_mc > 2) traits.push("overpowered heroes");
  if (profile.villain > 2) traits.push("dark stories");
  if (profile.romance > 2) traits.push("romantic plots");
  if (profile.shy > 2) traits.push("introverted characters");

  if (traits.length === 0) {
    return "You are still exploring your cinematic taste.";
  }

  return `You enjoy ${traits.join(", ")}.`;
};