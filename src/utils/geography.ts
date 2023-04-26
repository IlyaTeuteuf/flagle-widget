const DIRECTION_ARROWS = {
  N: '⬆️',
  NNE: '↗️',
  NE: '↗️',
  ENE: '↗️',
  E: '➡️',
  ESE: '↘️',
  SE: '↘️',
  SSE: '↘️',
  S: '⬇️',
  SSW: '↙️',
  SW: '↙️',
  WSW: '↙️',
  W: '⬅️',
  WNW: '↖️',
  NW: '↖️',
  NNW: '↖️',
};

export function getDirectionEmoji(guess: {
  direction: keyof typeof DIRECTION_ARROWS;
  distance: number;
}) {
  return guess.distance === 0 ? '🎉' : DIRECTION_ARROWS[guess.direction];
}

export function formatDistance(distance: number) {
  return `${Math.round(distance / 1000)}km`;
}
