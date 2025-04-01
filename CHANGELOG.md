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
