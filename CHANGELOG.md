# Changelog

## Innitial Release

### Added

- Initial version of the `daysToExpiry` function that calculates the remaining days until loan expiry based on the `dateExpected` date.
- Created the `Payment` interface to define the expected structure of the payment data.

## [1.0.0] - 2025-04-01

### Added

- Added the `lateDays` function to calculate the number of late days between a received date and an expected date.
- The function ensures that negative late days are not returned by using `Math.max(lateDays, 0)`.

## [1.0.1] - 2025-04-01

### Added

- Added the `interestDue` function to calculate the total interest due for payments that are marked as `PENDING` and have an installment number less than or equal to the current installment.

- The function sums the `interestDue` for each applicable payment.

## [1.0.2] - 2025-04-01

### Added
- Added support for generating a **payment schedule** with detailed installment information.
- The function calculates the schedule based on two payment methods: `DECLINING_BALANCE` and `INTEREST_ONLY`.
- It includes validation for input data to ensure accurate and reliable results.
- The payment schedule contains details such as `installmentAmount`, `principalDue`, `interestDue`, and `balance`.
- It calculates total payable amounts, principal payable, and interest charged over the loan period.
- Edge cases, such as handling remaining balance in the last installment, are addressed.
  
## [1.0.3] - 2025-04-01

### Added
- Added support for calculating the **loan term** based on the loan amount, interest rate, monthly payment, and payment method (`DECLINING_BALANCE` or `INTEREST_ONLY`).
  - The `term` function calculates how many months it will take to pay off the loan under the given conditions.
  - **Validation** is included to ensure that all inputs are valid, such as ensuring the monthly payment is greater than the interest payment for the `INTEREST_ONLY` method.
  - Added error handling to prevent infinite loops in cases where the loan payment is insufficient to cover the interest.
  - Supports two payment methods:
    - **DECLINING_BALANCE**: Principal decreases faster as payments are made, with interest recalculated on the remaining balance each month.
    - **INTEREST_ONLY**: Monthly payments cover only interest until the balance is paid off in the final installment.

## [1.0.0] - 2025-04-01