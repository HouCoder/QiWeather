// https://stackoverflow.com/a/25867068/4480674
export const getDirectionByAngle = (angle) => {
  const processedAngle = Math.floor((angle / 22.5) + 0.5);
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[(processedAngle % 16)];
};
