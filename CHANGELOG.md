# Changelog

## [Unreleased]

### Added
- Initial version of the `daysToExpiry` function that calculates the remaining days until loan expiry based on the `dateExpected` date.
- Created the `Payment` interface to define the expected structure of the payment data.

### Changed
- Simplified `daysToExpiry` function by removing redundant validation for `dateExpected` since TypeScript guarantees it's a `Date` object.
- Enhanced type safety with the correct typings for the function parameter and return value.

## [1.0.0] - 2025-04-01

### Initial Release
- Released the first version of the `daysToExpiry` function as an NPM package.
- Function calculates the remaining days until loan expiry by comparing the expected loan date to the current date.

## [Unreleased]

### Added
- Added the `lateDays` function to calculate the number of late days between a received date and an expected date. 
  - The function ensures that negative late days are not returned by using `Math.max(lateDays, 0)`.

### Changed
- Updated `daysToExpiry` function to maintain consistency with TypeScript and ensure proper date handling.

## [1.0.1] - 2025-04-01

### Initial Release
- Released the first version of the `loan-math` package.
- Implemented the `daysToExpiry` function that calculates the remaining days until loan expiry based on the expected date.
