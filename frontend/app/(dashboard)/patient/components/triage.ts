import { specialties } from "./specialties";

export function detectSpecialty(text: string): string | null {
  const input = text.toLowerCase();

  let bestSpecialty: string | null = null;
  let highestScore = 0;

  for (const specialty of specialties) {
    let score = 0;

    for (const keyword of specialty.keywords) {
      if (input.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestSpecialty = specialty.name;
    }
  }

  // No keywords matched
  if (highestScore === 0) {
    return null;
  }

  // Return the specialty with the highest score
  return bestSpecialty;
}