interface Payment {
  dateExpected: string; // ISO 8601 string format of the date
}

function daysToExpiry(dateExpected: Date): number {
  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds between the two dates
  const differenceMs = dateExpected.getTime() - currentDate.getTime();

  // Convert milliseconds to days
  const remainingDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  return remainingDays;
}

export { daysToExpiry };
