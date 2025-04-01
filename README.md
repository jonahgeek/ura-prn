# Loan Math

`loan-math` is a TypeScript package that provides useful utility functions for loan-related calculations.

## Functions

### 1. `daysToExpiry`

Calculates the number of days remaining until the loan expires based on the expected date.

#### Usage

```javascript
const { daysToExpiry } = require("loan-math");

const dateExpected = new Date("2025-05-01");
const remainingDays = daysToExpiry(dateExpected);

console.log(`Remaining days to loan expiry: ${remainingDays}`);
```

#### Parameters:

- `dateExpected: Date`: The expected expiry date of the loan.

#### Returns:

- `number`: The number of days remaining until the loan expires. Returns a positive number or `0` if the loan has already expired.

---

### 2. `lateDays`

Calculates the number of days a payment is late by comparing the received date to the expected date.

#### Usage

```javascript
const { lateDays } = require("loan-math");

const dateReceived = new Date("2025-04-01");
const dateExpected = new Date("2025-03-28");
const daysLate = lateDays(dateReceived, dateExpected);

console.log(`Late days: ${daysLate}`);
```

#### Parameters:

- `dateReceived: Date | string`: The actual date the payment was received.
- `dateExpected: Date | string`: The expected date the payment should have been made.

#### Returns:

- `number`: The number of days the payment is late. Returns `0` if the payment is not late.

---

### 3. `interestDue`

Calculates the total interest due for a loan based on pending payments up to the current installment.

#### Usage

```javascript
const { interestDue } = require("loan-math");

const payments = [
  { status: "PENDING", installmentNumber: 1, interestDue: 50 },
  { status: "PENDING", installmentNumber: 2, interestDue: 30 },
  { status: "PAID", installmentNumber: 3, interestDue: 0 },
];
const currentInstallment = 2;
const totalInterest = interestDue(payments, currentInstallment);

console.log(`Total interest due: ${totalInterest}`);
```

#### Parameters:

- `payments: Payment[]`: An array of payment objects, each with `status`, `installmentNumber`, and `interestDue`.
- `currentInstallment: number`: The current installment number to calculate interest up to.

#### Returns:

- `number`: The total interest due for the loan, considering only `PENDING` payments up to the specified installment.

---

### 4. `paymentSchedule`

Generates a detailed payment schedule based on the loan's payment method. It supports two methods: `DECLINING_BALANCE` and `INTEREST_ONLY`.

#### Usage

```javascript
const { paymentSchedule } = require("loan-math");

const monthlyRate = 5; // 5% interest rate
const period = 12; // 12 months
const monthlyDeposit = 500; // Monthly deposit amount
const principal = 5000; // Principal loan amount
const paymentMethod = "DECLINING_BALANCE"; // Payment method

const scheduleResult = paymentSchedule(
  monthlyRate,
  period,
  monthlyDeposit,
  principal,
  paymentMethod
);

console.log(scheduleResult.schedule); // Logs the full payment schedule
console.log(`Total Payable: ${scheduleResult.totalPayable}`);
console.log(`Principal Payable: ${scheduleResult.principalPayable}`);
console.log(`Interest Charged: ${scheduleResult.interestCharged}`);
```

#### Parameters:

- `monthlyRate: number`: The monthly interest rate as a percentage (e.g., for 5% monthly rate, pass `5`).
- `period: number`: The total number of months (loan term).
- `monthlyDeposit: number`: The amount paid monthly (not applicable for interest-only payments, but used in declining balance).
- `principal: number`: The total principal loan amount.
- `paymentMethod: 'DECLINING_BALANCE' | 'INTEREST_ONLY'`: The method for calculating payments. Choose between:
  - `'DECLINING_BALANCE'`: Monthly payment decreases as the principal is paid off.
  - `'INTEREST_ONLY'`: Only interest is paid each month, and the principal is repaid in full in the final installment.

#### Returns:

- An object containing:
  - `schedule`: An array of payment installments, each including `installmentNumber`, `installmentAmount`, `principalDue`, `interestDue`, `balance`, `status`, and `dateExpected`.
  - `totalPayable`: The total amount to be paid, including principal and interest.
  - `principalPayable`: The original loan principal.
  - `interestCharged`: The total interest charged over the course of the loan.

#### Example Output:

```json
{
  "schedule": [
    {
      "installmentNumber": 1,
      "installmentAmount": 500,
      "principalDue": 400,
      "interestDue": 100,
      "balance": 4500,
      "status": "PENDING",
      "dateExpected": "2025-05-01T00:00:00.000Z"
    }
    // Additional installments...
  ],
  "totalPayable": 6000,
  "principalPayable": 5000,
  "interestCharged": 1000
}
```

### 5. `term`

Calculates the number of months (loan term) required to pay off a loan based on the loan amount, interest rate, monthly payment, and the selected payment method.

#### Usage

```javascript
const { term } = require("loan-math");

const amount = 5000; // Principal loan amount
const interestRate = 5; // Annual interest rate as a percentage
const monthlyPayment = 500; // Monthly payment amount
const paymentMethod = "DECLINING_BALANCE"; // Payment method (DECLINING_BALANCE or INTEREST_ONLY)

try {
  const loanTerm = term(amount, interestRate, monthlyPayment, paymentMethod);
  console.log(`Loan term (in months): ${loanTerm}`);
} catch (error) {
  console.error(error.message);
}
```

#### Parameters:

- `amount: number`: The principal loan amount.
- `interestRate: number`: The annual interest rate as a percentage (e.g., for 5%, pass `5`).
- `monthlyPayment: number`: The amount paid monthly toward the loan.
- `paymentMethod: 'DECLINING_BALANCE' | 'INTEREST_ONLY'`: The payment method used to calculate the loan term.
  - `'DECLINING_BALANCE'`: The principal is paid down faster, and interest is recalculated on the remaining balance each month.
  - `'INTEREST_ONLY'`: Monthly payments cover only the interest, and the principal is paid off in the final installment.

#### Returns:

- `number`: The total number of months required to pay off the loan under the given conditions.

#### Throws:

- Throws an error if the `paymentMethod` is invalid or if the `INTEREST_ONLY` method has a monthly payment that is less than or equal to the interest payment, which would result in an infinite loan term.

#### Example Output:

```json
{
  "loanTerm": 10
}
```

## Installation

You can install the `loan-math` package via npm:

```bash
npm install loan-math
```

## License

This package is licensed under the [ISC License](https://opensource.org/licenses/ISC).

## Contributing

Please feel free to contribute to this package. If you have suggestions or improvements, feel free to open an issue or pull request.

---

## Example

Here’s an example usage of all three functions together:

```javascript
const { daysToExpiry, lateDays, interestDue } = require("loan-math");

// Example data
const payments = [
  { status: "PENDING", installmentNumber: 1, interestDue: 50 },
  { status: "PENDING", installmentNumber: 2, interestDue: 30 },
  { status: "PAID", installmentNumber: 3, interestDue: 0 },
];

const currentInstallment = 2;
const dateExpected = new Date("2025-05-01");
const dateReceived = new Date("2025-04-01");

// Usage of daysToExpiry
const remainingDays = daysToExpiry(dateExpected);
console.log(`Remaining days to loan expiry: ${remainingDays}`);

// Usage of lateDays
const daysLate = lateDays(dateReceived, dateExpected);
console.log(`Late days: ${daysLate}`);

// Usage of interestDue
const totalInterest = interestDue(payments, currentInstallment);
console.log(`Total interest due: ${totalInterest}`);
```
