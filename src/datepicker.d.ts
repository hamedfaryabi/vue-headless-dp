import { Locale } from "date-fns";

/**
 * Base options for configuring the behavior of the datepicker.
 */
export interface DPBaseOptions {
  /**
   * Type of the calendar of datepicker
   */
  calendar?: "jalali" | "gregorian";

  /**
   * Defines the start of the week.
   * 0 corresponds to Sunday, 1 to Monday, and so on.
   */
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Value to initialize the month of the datepicker.
   * If provided, displays the selected month starting from this year.
   * If not provided, displays the current month.
   */
  initialMonth?: number;

  /**
   * Value to initialize the year of the datepicker.
   * If provided, displays the selected year.
   * If not provided, displays the current year.
   */
  initialYear?: number;

  /**
   * If true, show days of the previous month in the first week and
   * days of the next month in the last week.
   * If true, the length of all weeks is fixed to 7 days.
   */
  equalWeeks?: boolean;

  /**
   * Defines the selection type for the datepicker.
   * - "single": Can select only one date.
   * - "multiple": Can select an array of dates.
   * - "range": Can select a range with a start and end date.
   */
  selectType?: "single" | "multiple" | "range";

  /**
   * To specify the disabled days of the calendar.
   */
  disabled?: Date[];

  /**
   * To specify minimum valid date of the datepicker
   */
  minDate?: Date;

  /**
   * To specify maximum valid date of the datepicker
   */
  maxDate?: Date;

  locale?: Locale;
}

/**
 * Options for single-date selection mode.
 */
export interface DPSingleSelectOptions extends DPBaseOptions {
  selectType?: "single";
  selected?: Date;
}

/**
 * Options for multi-date selection mode.
 */
export interface DPMultiSelectOptions extends DPBaseOptions {
  selectType?: "multiple";
  selected?: Date[];
}

/**
 * Options for range-date selection mode.
 */
export interface DPRangeSelectOptions extends DPBaseOptions {
  selectType?: "range";
  selected?: { from: Date; to: Date };
}

/**
 * A union of all possible options configurations.
 */
export type DPOptions =
  | DPSingleSelectOptions
  | DPMultiSelectOptions
  | DPRangeSelectOptions;

/**
 * Represents the full name of a month.
 */
export type DPMonthName = {
  narrow: string;
  abbreviated: string;
  wide: string;
};

/**
 * Represents the full name of a day in a week.
 */
export type DPDayInWeekName = {
  narrow: string;
  short: string;
  abbreviated: string;
  wide: string;
};

/**
 * Represents a day in the datepicker.
 */
export interface DPDay {
  date: Date;
  weekIndex: number;
  monthindex: number;
  today: boolean;
  weekName: DPDayInWeekName;
  inMonth: boolean;
  selected: boolean;
  disabled: boolean;
  belowMin: boolean;
  aboveMax: boolean;
}

/**
 * Represents a week in the datepicker.
 */
export interface DPWeek {
  days: DPDay[];
  number: number;
}

/**
 * Represents a month in the datepicker.
 */
export interface DPMonth {
  name: DPMonthName;
  number: number;
  weeks: DPWeek[];
  year: number;
}
