
# Vue Headless Date Picker

Vue Headless Date Picker is a flexible and customizable date picker composable for Vue 3 that allows you to easily add date selection functionality to your Vue.js applications.

## Features

- Supports single-date, multi-date, and range-date selection modes.
- Equal-weeks option for consistent week display.
- Date range limiting with minDate and maxDate options.
- Easily disable specific dates.
- No UI, giving you complete control over the user interface.

## Installation

To get started, install the `vue-headless-date-picker` package from npm:

```bash
npm install @hamedfaryabi/vue-headless-date-picker
# or
yarn add @hamedfaryabi/vue-headless-date-picker
```

## Usage

```javascript
import { useHeadlessDatePicker } from "@hamedfaryabi/vue-headless-date-picker";

// Import a `@date-io` adapter, in this case, DateFnsAdapter
import DateFnsAdapter from "@date-io/date-fns";

// Create a new instance of the DateFnsAdapter
const adapter = new DateFnsAdapter();

const dp = useHeadlessDatePicker(adapter, {
  selectType: "single",
  equalWeeks: false,
  minDate: new Date(),
});

dp.selected.value = new Date(2022-01-12);
console.log(dp.currentYear.value); // 2022
```

## Documentation

### `useHeadlessDatePicker(adapter, options)`

This function initializes the Vue Headless Datepicker and returns an object containing various properties and methods to manage the date picker's state and behavior.

**Parameters:**

- `adapter` (required): An instance of a date adapter that implements [`@date-io`](https://github.com/dmtrKovalenko/date-io) adapters. This adapter is used for date-related operations.
- `options` (optional): An object containing configuration options for the date picker. See [Options](#options) for available options.

**Returns:**

An object with the following properties and methods:

| **Property/Method**                  | **Description**                                                                      | **Type**                    |
|-------------------------------------|--------------------------------------------------------------------------------------|-----------------------------|
| `state`                             | An object that holds the internal state of the date picker, including selected dates, current month, and more. | Object                      |
| `getMonthOfDate(date: Date)`        | A function that takes a `Date` object and returns a `DPMonth` object representing the month containing the provided date. | Function                    |
| `isDateSelected(date: Date)`        | A function that checks if a given date is selected according to the date picker's selection mode. | Function                    |
| `isDateDisabled(date: Date)`        | A function that checks if a given date is disabled based on the provided disabled dates. | Function                    |
| `currentMonth`                      | A computed property that gets or sets the current month of the date picker. It returns a `DPMonth` object. | Computed Property           |
| `currentYear`                       | A computed property that gets or sets the current year of the date picker.           | Computed Property           |
| `selected`                          | A computed property that gets or sets the selected date(s) based on the date picker's selection mode. | Computed Property           |
| `disabled`                          | A computed property that gets or sets the disabled date(s).                           | Computed Property           |
| `minDate`                           | A computed property that gets or sets the minimum selectable date.                    | Computed Property           |
| `maxDate`                           | A computed property that gets or sets the maximum selectable date.                    | Computed Property           |

**Note:** All computed properties have getters and setters.
for example:

```javascript
    datePicker.minDate.value = new Date(); // set the min date
    const min = datePicker.minDate; // returns the min date
```

### Options

Basic configuration options for the date picker

| **Property**       | **Description**                                                                                              | **Type**  |
|--------------------|--------------------------------------------------------------------------------------------------------------|-----------|
| `initialMonth`     | Value to initialize the month of the date picker. If not provided, displays the current month.              | `number`  |
| `initialYear`      | Value to initialize the year of the date picker. If not provided, displays the current year.                | `number`  |
| `equalWeeks`       | If `true`, returns days of the previous month in the first week and days of the next month in the last week. | `boolean` |
| `selectType`       | Defines the selection type for the date picker (`single`, `multiple`, or `range`).                                 | `string`  |
| `disabled`         | An array of disabled dates.                                                                                  | `Date[]`  |
| `minDate`          | The minimum valid date of the date picker.                                                                    | `Date`    |
| `maxDate`          | The maximum valid date of the date picker.                                                                    | `Date`    |

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details.
