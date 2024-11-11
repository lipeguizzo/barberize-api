export function assessmentNote(notes: number[]): number {
  if (notes.length === 0) return 0;

  const summation: number = notes.reduce((acc, nota) => acc + nota, 0);
  const average = summation / notes.length;
  return Math.round(average);
}
