interface Payment {
  status: "PENDING" | "PAID" | "IN_REVIEW"; // Payment status options
  installmentNumber: number; // The installment number of the payment
  interestDue: number; // The interest amount due for the payment
}

interface PaymentScheduleEntry {
  installmentNumber: number;
  installmentAmount: number | string;
  principalDue: number;
  interestDue: number;
  balance: number;
  status: string;
  dateExpected: Date;
}

interface PaymentScheduleResult {
  schedule: PaymentScheduleEntry[];
  totalPayable: number;
  principalPayable: number;
  interestCharged: number;
}

type PaymentMethod = "DECLINING_BALANCE" | "INTEREST_ONLY";

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

function validatePaymentScheduleInputs(
  monthlyRate: number,
  period: number,
  monthlyDeposit: number,
  principal: number,
  paymentMethod: PaymentMethod
): boolean {
  if (isNaN(monthlyRate) || monthlyRate <= 0) {
    console.error("Invalid monthly rate.");
    return false;
  }
  if (isNaN(period) || period <= 0) {
    console.error("Invalid period.");
    return false;
  }
  if (isNaN(monthlyDeposit) || monthlyDeposit <= 0) {
    console.error("Invalid monthly deposit.");
    return false;
  }
  if (isNaN(principal) || principal <= 0) {
    console.error("Invalid principal amount.");
    return false;
  }
  if (!["DECLINING_BALANCE", "INTEREST_ONLY"].includes(paymentMethod)) {
    console.error("Invalid payment method.");
    return false;
  }
  return true;
}

function paymentSchedule(
  monthlyRate: number,
  period: number,
  monthlyDeposit: number,
  principal: number,
  paymentMethod: PaymentMethod
): PaymentScheduleResult | null {
  if (
    !validatePaymentScheduleInputs(
      monthlyRate,
      period,
      monthlyDeposit,
      principal,
      paymentMethod
    )
  ) {
    return null;
  }

  let schedule: PaymentScheduleEntry[] = [];
  let totalPayable = 0;
  let principalPayable = 0;
  let interestCharged = 0;

  if (paymentMethod === "DECLINING_BALANCE") {
    let newPrincipal = principal;

    // Get current date
    let currentDate = new Date();

    for (let i = 1; i <= period; i++) {
      let interestDue = Math.round((monthlyRate / 100) * newPrincipal);
      let balance = newPrincipal + interestDue;

      let expectedDate = new Date(currentDate);
      expectedDate.setMonth(expectedDate.getMonth() + i);

      schedule.push({
        installmentNumber: i,
        installmentAmount: i === 1 ? 0 : Math.round(monthlyDeposit),
        principalDue: Math.round(newPrincipal),
        interestDue: interestDue,
        balance: Math.round(balance),
        status: "PENDING",
        dateExpected: expectedDate,
      });

      // Calculate new principal for next month
      newPrincipal -= Math.round(monthlyDeposit - interestDue);
    }

    // Calculate total payable, principal payable, and interest charged
    principalPayable = Math.round(principal);
    interestCharged = schedule.reduce(
      (acc, month) => acc + month.interestDue,
      0
    );
    totalPayable = principalPayable + interestCharged;

    // If there's a remaining balance in the last installment, create a new installment for it
    if (schedule[period - 1]?.balance > 0) {
      let remainingBalance = schedule[period - 1].balance;

      let expectedDate = new Date(currentDate);
      expectedDate.setMonth(expectedDate.getMonth() + period);

      schedule.push({
        installmentNumber: period + 1,
        installmentAmount: remainingBalance,
        principalDue: 0,
        interestDue: 0,
        balance: 0,
        status: "PENDING",
        dateExpected: expectedDate,
      });
    }

    return {
      schedule: schedule,
      totalPayable: totalPayable,
      principalPayable: principalPayable,
      interestCharged: interestCharged,
    };
  } else if (paymentMethod === "INTEREST_ONLY") {
    let newPrincipal = principal;
    let currentDate = new Date();

    // Add an initial installment with blank installmentAmount
    schedule.push({
      installmentNumber: 0,
      installmentAmount: 0,
      principalDue: principal,
      interestDue: Math.round((monthlyRate / 100) * principal),
      balance: principal + Math.round((monthlyRate / 100) * principal),
      status: "PENDING",
      dateExpected: currentDate,
    });

    for (let i = 1; i <= period; i++) {
      let interestDue = Math.round((monthlyRate / 100) * newPrincipal);
      let balance = newPrincipal;

      let expectedDate = new Date(currentDate);
      expectedDate.setMonth(expectedDate.getMonth() + i);

      if (i < period) {
        schedule.push({
          installmentNumber: i,
          installmentAmount: Math.round(interestDue),
          principalDue: principal,
          interestDue: interestDue,
          balance: balance + interestDue,
          status: "PENDING",
          dateExpected: expectedDate,
        });
      } else {
        schedule.push({
          installmentNumber: i,
          installmentAmount: Math.round(interestDue + newPrincipal),
          principalDue: 0,
          interestDue: 0,
          balance: 0,
          status: "PENDING",
          dateExpected: expectedDate,
        });
      }
    }

    interestCharged = schedule.reduce(
      (acc, month) =>
        acc + (typeof month.interestDue === "number" ? month.interestDue : 0),
      0
    );

    totalPayable = principal + interestCharged;

    return {
      schedule: schedule,
      totalPayable: totalPayable,
      principalPayable: principalPayable,
      interestCharged: interestCharged,
    };
  }

  return null;
}

export { daysToExpiry, lateDays, interestDue, paymentSchedule };
