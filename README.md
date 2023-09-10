# Vue.js Headless Date Picker Composable Documentation

## Introduction

The Vue.js Headless Date Picker Composable is a utility that provides date-related functionality for Vue.js applications. It offers a set of functions and options to manage dates, calendars, and date selections.

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

### Creating a Headless Date Picker Instance

```javascript
const datePicker = useHeadlessDatePicker();
```

### Configuration Options

The composable supports the following configuration options:

- `calendar` (default: "jalali" | "gregorian"): Specifies the type of calendar to be used ("jalali" or "gregorian").
- `weekStart` (default: 1): Determines the start day of the week (0 for Sunday, 1 for Monday, etc.).
- `initialMonth`: Sets the initial month to be displayed.
- `initialYear`: Sets the initial year to be displayed.
- `equalWeeks` (default: true): Controls whether days from previous and next months are shown to create equal-length weeks.
- `selectType` (default: "single" | "multiple" | "range"): Defines the selection mode ("single", "multiple", or "range").
- `selected`: Represents selected date(s) based on the selection mode.
- `disabled`: An array of disabled dates.
- `minDate`: Specifies the minimum valid date.
- `maxDate`: Specifies the maximum valid date.
- `locale`: Configures locale settings for date formatting.

### Functions

The composable provides several functions:

- `getMonthOfDate(date: Date): DPMonth`: Retrieves the month for a given date.
- `getCurrentMonth(): DPMonth`: Retrieves the current month.
- `getCalendarMonth(): DPMonth`: Retrieves the month based on the configuration options.
- `setMonth(month: number): void`: Sets the initial month.
- `setYear(year: number): void`: Sets the initial year.
- `setMonthYear(month: number, year: number): void`: Sets both the initial month and year.
- `setSelected(date: Date | Date[] | { from: Date; to: Date }): void`: Sets selected date(s).
- `getSelected(): Date | Date[] | { from: Date; to: Date }`: Retrieves selected date(s).
- `isDateSelected(date: Date): boolean`: Checks if a date is selected.
- `setDisabled(date: Date | Date[]): void`: Disables specific dates.
- `setMinDate(date: Date): void` : Specifies minimum valid date.
-  `setMaxDate(date : Date) : void`.Sets maximum valid date
- setLocale(locale : Locale) :Set locale for formatting dates
- isDateDisabled( date : Date) Returns true if a specific datae has been disabled

## Examples

Here are some usage examples:

### Initializing the Headless DatePicker Instance

```javascript
const datePicker = useHeadlessDatePicker();
```

### Setting an Initial Month and Year

```javascript
datePicker.setMonth(5); // Set June as the initial month
datePicker.setYear(2023); // Set 2023 as tthe intiial year
```

### Selecting a Specific Day
 
```javascript
datePicker.setSelected(new  Date (2023, 5,15)); Setsingle day selection by passing in one single dte object
```

### Disabling Specific Dates

```javascript
datePicker.setDisabled([new Date(2023, 5, 10), new Date(2023, 5, 20)]); // Disable specific dates by passing in an array of date objects
```

## License

This composable is released under the MIT License. For more details, see the [LICENSE](LICENSE) file.
