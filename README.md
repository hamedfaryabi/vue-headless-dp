# Vue.js Headless Date Picker Composable Documentation

## Introduction

The Vue.js Headless Date Picker Composable is a utility for managing date-related functionality in Vue.js applications. It provides a set of functions and options to work with dates, calendars, and date selections.

## Installation

To use this composable in your Vue.js project, you can install it via npm or yarn:

```bash
npm install vue-headless-date-picker
# or
yarn add vue-headless-date-picker
```

## Usage

### Importing the Composable

```javascript
import { useHeadlessDatePicker } from 'vue-headless-date-picker';
```

### Creating a Headless Date Picker

```javascript
const datePicker = useHeadlessDatePicker();
```

### Configuration Options

The composable supports the following configuration options:

- `calendar` (default: "jalali" | "gregorian"): Type of calendar to use ("jalali" or "gregorian").
- `weekStart` (default: 1): Start of the week (0 for Sunday, 1 for Monday, etc.).
- `initialMonth`: Initial month to display.
- `initialYear`: Initial year to display.
- `equalWeeks` (default: true): Whether to show days from the previous and next months to create equal-length weeks.
- `selectType` (default: "single" | "multiple" | "range"): Selection mode ("single", "multiple", or "range").
- `selected`: Selected date(s) based on the selection mode.
- `disabled`: An array of disabled dates.
- `minDate`: Minimum valid date.
- `maxDate`: Maximum valid date.
- `locale`: Locale settings for date formatting.

### Functions

The composable provides the following functions:

- `getMonthOfDate(date: Date): DPMonth`: Get the month for a given date.
- `getCurrentMonth(): DPMonth`: Get the current month.
- `getCalendarMonth(): DPMonth`: Get the month based on configuration options.
- `setMonth(month: number): void`: Set the initial month.
- `setYear(year: number): void`: Set the initial year.
- `setMonthYear(month: number, year: number): void`: Set both initial month and year.
- `setSelected(date: Date | Date[] | { from: Date; to: Date }): void`: Set the selected date(s).
- `getSelected(): Date | Date[] | { from: Date; to: Date }`: Get the selected date(s).
- `isDateSelected(date: Date): boolean`: Check if a date is selected.
- `setDisabled(date: Date | Date[]): void`: Set disabled days.
- `setMinDate(date: Date): void`: Set the minimum valid date.
- `setMaxDate(date: Date): void`: Set the maximum valid date.
- `setLocale(locale: Locale): void`: Set the locale for date formatting.
- `isDateDisabled(date: Date): boolean`: Check if a date is disabled.

## Examples

Here are some usage examples:

### Initializing the Date Picker

```javascript
const datePicker = useHeadlessDatePicker();
```

### Setting the Initial Month and Year

```javascript
datePicker.setMonth(5); // Set the initial month to June
datePicker.setYear(2023); // Set the initial year to 2023
```

### Selecting a Date

```javascript
datePicker.setSelected(new Date(2023, 5, 15)); // Select a single date
```

### Disabling Dates

```javascript
datePicker.setDisabled([new Date(2023, 5, 10), new Date(2023, 5, 20)]); // Disable specific dates
```

## License

This composable is released under the MIT License. See the [LICENSE](LICENSE) file for details.
