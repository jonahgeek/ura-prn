interface Payment {
  status: "PENDING" | "PAID" | "IN_REVIEW"; // Payment status options
  installmentNumber: number; // The installment number of the payment
  interestDue: number; // The interest amount due for the payment
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

function interestDue(payments: Payment[], currentInstallment: number): number {
  // Initialize total interest due to 0
  let totalInterestDue = 0;

  // Iterate through each payment in the payments array
  for (const payment of payments) {
    // Check if the payment status is 'PENDING' and installment number is less than or equal to current installment
    if (
      payment.status === "PENDING" &&
      payment.installmentNumber <= currentInstallment
    ) {
      // Add the interestDue of the current payment to the total
      totalInterestDue += payment.interestDue;
    }
  }

  // Return the total interest due
  return totalInterestDue;
}

export { daysToExpiry, lateDays, interestDue };
