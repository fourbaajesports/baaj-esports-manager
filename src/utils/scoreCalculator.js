export function calculateScore({
  kills = 0,
  placement = 0,
  roomJoined = true,
  chicken = false,
  noNotice = false,
}) {
  let score = 0;

  // Room Join
  if (roomJoined) score += 1;

  // Kills
  score += Number(kills);

  // Chicken Dinner
  if (chicken) score += 2;

  // Placement Bonus
  if (placement >= 2 && placement <= 8) {
    score += 1;
  }

  // Penalty
  if (noNotice) {
    score -= 1;
  }

  return score;
}