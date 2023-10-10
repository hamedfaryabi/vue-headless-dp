import type { DPDay, DPMonth, DPOptions, DPWeek } from "./datepicker";
import { defu } from "defu";
import { computed, reactive } from "vue";
import { IUtils } from "@date-io/core/IUtils";

/**
 * Calculates the week index of a given date within a month.
 *
 * @param {Date} date - The date for which to calculate the week index.
 * @param {IUtils<Date>} adapter - The date adapter.
 * @returns {number} - The week index.
 */
function getWeekIndex(date: Date, adapter: IUtils<Date>): number {
  const monthStart = adapter.startOfMonth(date);
  const currentDate = date.getDate();

  let weekIndex = 0;
  let currentDay = monthStart;

  while (currentDay.getDate() <= currentDate) {
    currentDay = adapter.addDays(currentDay, 1);
    if (currentDay.getDay() === 0) {
      weekIndex++;
    }
  }

  return weekIndex;
}

/**
 * Retrieves each day within the specified date interval.
 *
 * @param {Date} start - The start date of the interval.
 * @param {Date} end - The end date of the interval.
 * @param {IUtils<Date>} adapter - The date adapter.
 * @returns {Date[]} - An array of dates within the interval.
 */
function getEachDayOfInterval(
  start: Date,
  end: Date,
  adapter: IUtils<Date>
): Date[] {
  let current = adapter.date(start);

  if (!current || adapter.isAfterDay(start, end)) {
    return [];
  }

  if (adapter.isSameDay(end, start)) {
    return [start];
  }

  const days: Date[] = [];
  while (adapter.isBeforeDay(current, end)) {
    days.push(current);
    current = adapter.addDays(current, 1);
  }

  return days;
}

export function useHeadlessDatePicker(
  adapter: IUtils<Date>,
  options?: DPOptions
) {
  const optionsRef: DPOptions = reactive<DPOptions>({
    initialMonth: undefined,
    initialYear: undefined,
    equalWeeks: true,
    selected: undefined,
    selectType: "single",
    disabled: [],
    minDate: undefined,
    maxDate: undefined,
  });

  // Merge provided options with default options
  const _options = reactive<DPOptions>(defu(options, optionsRef) as DPOptions);

  const state = reactive({
    selected: _options.selected,
    currentMonth: _options.initialMonth || new Date().getMonth() + 1,
    currentYear: _options.initialYear || new Date().getFullYear(),
    disabled: _options.disabled || [],
    minDate: _options.minDate,
    maxDate: _options.maxDate,
  });

  /**
   * Checks if a date is valid.
   *
   * @param {Date|undefined} date - The date to check.
   * @param {boolean} allowUndefined - Whether to allow undefined dates.
   * @returns {boolean} - True if the date is valid, false otherwise.
   * @throws {Error} - Throws an error if the provided date is invalid.
   */
  const checkDate = (
    date: Date | undefined,
    allowUndefined?: boolean
  ): boolean => {
    if (allowUndefined && !date) {
      return true;
    }

    if (adapter.isValid(date)) return true;
    else throw new Error("The provided date is invalid");
  };

  /**
   * Checks if a date is selected.
   *
   * @param {Date} date - The date to check.
   * @returns {boolean} - True if the date is selected, false otherwise.
   */
  const isDateSelected = (date: Date): boolean => {
    if (!state.selected || !checkDate(date)) return false;

    switch (_options.selectType) {
      case "single":
        return adapter.isSameDay(date, state.selected as Date);
      case "multiple":
        return (state.selected as Date[]).some((d) =>
          adapter.isSameDay(date, d)
        );
      case "range":
        return isWithinRange(date);
      default:
        return false;
    }
  };

  /**
   * Checks if a date is disabled.
   *
   * @param {Date} date - The date to check.
   * @returns {boolean} - True if the date is disabled, false otherwise.
   */

  const isDateDisabled = (date: Date): boolean => {
    if (!state.disabled || state.disabled.length < 1 || !checkDate(date))
      return false;

    return (
      state.disabled.findIndex((d: Date) => adapter.isSameDay(date, d)) > -1
    );
  };

  /**
   * Checks if a date is within a selected range.
   *
   * **Note: Only works if type is "range"**
   *
   * @param {Date} date - The date to check.
   * @returns {boolean} - True if the date is within the range, false otherwise.
   */
  const isWithinRange = (date: Date): boolean => {
    if (!state.selected || !checkDate(date)) return false;

    const selected = state.selected as { from: Date; to: Date };
    const interval: [Date, Date] = [
      adapter.startOfDay(selected.from),
      adapter.endOfDay(selected.to),
    ];

    return adapter.isWithinRange(date, interval);
  };

  /**
   * Converts a date to a datepicker day object.
   *
   * @param {Date} date - The date to convert.
   * @returns {DPDay} - The day object.
   */
  const dateToDay = (date: Date): DPDay => {
    checkDate(date);

    const isBelowMinDate = state.minDate
      ? adapter.isBefore(
          adapter.startOfDay(date),
          adapter.startOfDay(state.minDate)
        )
      : false;

    const isAboveMaxDate = state.maxDate
      ? adapter.isAfter(
          adapter.startOfDay(date),
          adapter.startOfDay(state.maxDate)
        )
      : false;

    return {
      date,
      monthindex: adapter.getDate(date),
      today: adapter.isSameDay(date, new Date()),
      weekIndex: getWeekIndex(date, adapter),
      weekName: {
        full: adapter.format(date, "weekday"),
        short: adapter.format(date, "weekdayShort"),
      },
      thisMonth: adapter.isSameMonth(date, new Date()),
      selected: isDateSelected(date),
      disabled:
        state.disabled?.some((d) => adapter.isSameDay(d, date)) || false,
      belowMin: isBelowMinDate,
      aboveMax: isAboveMaxDate,
    };
  };

  /**
   * Converts an array of dates to an array of datepicker weeks.
   *
   * @param {Date[]} dates - The array of dates.
   * @returns {DPWeek[]} - An array of week objects.
   */
  const datesToWeeks = (dates: Date[]): DPWeek[] => {
    dates.every((date) => checkDate(date));
    const daysByWeeks = dates.reduce((acc: DPDay[][], date) => {
      const weekNumber = getWeekIndex(date, adapter);
      const day: DPDay = dateToDay(date);

      if (!acc[weekNumber - 1]) acc[weekNumber - 1] = [];
      acc[weekNumber - 1].push(day);

      return acc;
    }, []);

    return daysByWeeks.map((days) => ({
      days: days,
      number: getWeekIndex(days[0].date, adapter),
    }));
  };

  /**
   * Gets the datepicker month for a given date.
   *
   * @param {Date} date - The date for which to retrieve the month information.
   * @returns {DPMonth} - The month object.
   */
  const getMonthOfDate = (date: Date): DPMonth => {
    checkDate(date);
    const monthStart = adapter.startOfMonth(date),
      monthEnd = adapter.endOfMonth(date);

    const allDays = getEachDayOfInterval(monthStart, monthEnd, adapter);
    const weeks: DPWeek[] = datesToWeeks(allDays);

    // Code to ensure equal weeks, if applicable
    if (_options.equalWeeks) {
      if (weeks[0].days.length < 7) {
        const diff = 7 - weeks[0].days.length;
        const startDate = weeks[0].days[0].date;

        for (let index = 1; index <= diff; index++) {
          weeks[0].days.unshift(
            dateToDay(adapter.addDays(startDate, index * -1))
          );
        }
      }

      const weeksLastIndex = weeks.length - 1;
      if (weeks[weeksLastIndex].days.length < 7) {
        const daysLength = weeks[weeksLastIndex].days.length;
        const diff = 7 - daysLength;
        const startDate = weeks[weeksLastIndex].days[daysLength - 1].date;

        for (let index = 1; index <= diff; index++) {
          weeks[weeksLastIndex].days.push(
            dateToDay(adapter.addDays(startDate, index))
          );
        }
      }
    }

    const sampleDate = allDays[0];
    const month: DPMonth = {
      weeks: weeks,
      name: {
        full: adapter.format(sampleDate, "month"),
        short: adapter.format(sampleDate, "monthShort"),
      },
      number: adapter.getMonth(sampleDate) + 1,
      year: adapter.getYear(sampleDate),
    };

    return month;
  };

  /**
   * Computed property to get/set the current month of datepicker.
   */
  const currentMonth = computed<DPMonth>({
    get() {
      const d = new Date();
      if (state.currentYear) {
        d.setFullYear(state.currentYear);
      }
      if (state.currentMonth) {
        d.setMonth(state.currentMonth - 1);
      }

      return getMonthOfDate(d);
    },
    set(month: DPMonth | number) {
      if (typeof month === "number") {
        state.currentMonth = month;
      } else if ("number" in month) {
        state.currentMonth = month.number;
      } else {
        throw new Error("The given month is not correct format of month");
      }
    },
  });

  /**
   * Computed property to get/set the current year of datepicker.
   */
  const currentYear = computed<number>({
    get() {
      return state.currentYear;
    },
    set(year: number) {
      state.currentYear = year;
    },
  });

  /**
   * Computed property to get/set the selected dates of datepicker.
   */
  const selected = computed<(typeof state)["selected"]>({
    get() {
      return state.selected;
    },
    set(date: (typeof state)["selected"]) {
      if (!date) {
        throw new Error("No date provided.");
      }

      const { selectType } = _options;

      if (selectType === "single" && !(date instanceof Date)) {
        throw new Error("Invalid date format for 'single' selectType");
      }

      if (
        selectType === "multiple" &&
        (!Array.isArray(date) || !date.every((d) => d instanceof Date))
      ) {
        throw new Error("Invalid date format for 'multiple' selectType");
      }

      if (
        selectType === "range" &&
        (!("from" in date) ||
          !("to" in date) ||
          !(date.from instanceof Date) ||
          !(date.to instanceof Date))
      ) {
        throw new Error("Invalid date format for 'range' selectType");
      }

      state.selected = date;
    },
  });

  /**
   * Computed property to get/set the disabled dates of datepicker.
   */
  const disabled = computed<Date | Date[]>({
    get() {
      return state.disabled;
    },
    set(date: Date | Date[]) {
      if (!Array.isArray(date)) {
        date = [date];
      } else {
        state.disabled = date;
      }
    },
  });

  /**
   * Computed property to get/set the minimum selectable date of datepicker.
   */
  const minDate = computed<Date | undefined>({
    get() {
      return state.minDate;
    },
    set(date?: Date) {
      checkDate(date, true);
      state.minDate = date;
    },
  });

  /**
   * Computed property to get/set the maximum selectable date of datepicker.
   */
  const maxDate = computed<Date | undefined>({
    get() {
      return state.maxDate;
    },
    set(date?: Date) {
      checkDate(date, true);
      state.maxDate = date;
    },
  });

  return {
    // ----- state & options ------
    state,

    // ----- functions ------
    getMonthOfDate,
    isDateSelected,
    isDateDisabled,

    // ----- values ------
    currentMonth,
    currentYear,
    selected,
    disabled,
    minDate,
    maxDate,
  };
}
