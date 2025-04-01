# Loan Math

`loan-math` is a TypeScript package that provides useful utility functions for loan-related calculations, including calculating the remaining days until loan expiry, late days, and interest due.

## Functions

### 1. `daysToExpiry`

Calculates the number of days remaining until the loan expires based on the expected date.

#### Usage

```javascript
const { daysToExpiry } = require('loan-math');

const dateExpected = new Date('2025-05-01');
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
const { lateDays } = require('loan-math');

const dateReceived = new Date('2025-04-01');
const dateExpected = new Date('2025-03-28');
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
const { interestDue } = require('loan-math');

const payments = [
  { status: 'PENDING', installmentNumber: 1, interestDue: 50 },
  { status: 'PENDING', installmentNumber: 2, interestDue: 30 },
  { status: 'PAID', installmentNumber: 3, interestDue: 0 }
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
const { daysToExpiry, lateDays, interestDue } = require('loan-math');

// Example data
const payments = [
  { status: 'PENDING', installmentNumber: 1, interestDue: 50 },
  { status: 'PENDING', installmentNumber: 2, interestDue: 30 },
  { status: 'PAID', installmentNumber: 3, interestDue: 0 }
];

const currentInstallment = 2;
const dateExpected = new Date('2025-05-01');
const dateReceived = new Date('2025-04-01');

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