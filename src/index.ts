function daysToExpiry(dateExpected: Date): number {
  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds between the two dates
  const differenceMs = dateExpected.getTime() - currentDate.getTime();

  // Convert milliseconds to days
  const remainingDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  return remainingDays;
}

function lateDays(
  dateReceived: string | Date,
  dateExpected: string | Date
): number {
  // Ensure both dates are converted to Date objects
  const expected = new Date(dateExpected);
  const received = new Date(dateReceived);

  // Calculate the difference in milliseconds between the expected and received dates
  const differenceMs = received.getTime() - expected.getTime();

  // Convert milliseconds to days
  const lateDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  // Return the number of late days, ensuring it's not negative
  return Math.max(lateDays, 0);
}

export { daysToExpiry, lateDays };
