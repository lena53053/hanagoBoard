const SKILLS_DATA = {
  // Skill 1 (first physicSkillElement / magicSkillElement)
  skill1: {
    gen1Thresholds: [75, 190, 380, 605, 910, 1215, 1520, 1650, 1800],
    gen2Thresholds: [75, 190, 380, 605, 910, 1215, 1520, 1650, 1800, 2060, 2320, 2520, 2760],
    // { skillLevel: requiredFlowerLevel }
    gen1Locks: { 8: 10, 9: 10 },
    gen2Locks: { 12: 10, 13: 10 },
  },
  // Skill 2 (second physicSkillElement / magicSkillElement)
  skill2: {
    gen1Thresholds: [75, 190, 380, 605, 910, 1140, 1365],
    gen2Thresholds: [75, 190, 380, 605, 910, 1140, 1365, 1565, 1740, 1910, 2085],
    gen1Locks: { 6: 11, 7: 13 },
    gen2Locks: { 10: 11, 11: 13 },
  },
};
