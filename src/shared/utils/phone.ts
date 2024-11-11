export function removeDigitNine(phone: string): string {
  const regex = /^\((\d{2})\)\s9(\d{4})-(\d{4})$/;
  const match = phone.match(regex);

  if (match) {
    return `${match[1]}${match[2]}${match[3]}`;
  }

  return phone;
}
