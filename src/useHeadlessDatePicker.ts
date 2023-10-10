import type { DPDay, DPMonth, DPOptions, DPWeek } from "./datepicker";
import { defu } from "defu";
import { computed, reactive } from "vue";
import { IUtils } from "@date-io/core/IUtils";

function getWeekIndex(date: Date, adapter: IUtils<Date>) {
  const monthStart = adapter.startOfMonth(date);
  const currentDate = date.getDate();

  // Calculate the week index
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

function getEachDayOfInterval(start: Date, end: Date, adapter: IUtils<Date>) {
  let current = adapter.date(start);

  if (!current) {
    return [];
  }

  if (adapter.isAfterDay(start, end)) {
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

export function useHeadlessDatePicker(options?: DPOptions) {
  const optionsRef: DPOptions = reactive<DPOptions>({
    adapter: null,
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

  if (!_options.adapter!) {
    throw new Error("Please define adapter in options");
  }

  const state = reactive({
    selected: _options.selected,
    currentMonth: _options.initialMonth || new Date().getMonth() + 1,
    currentYear: _options.initialYear || new Date().getFullYear(),
    disabled: _options.disabled || [],
    minDate: _options.minDate,
    maxDate: _options.maxDate,
  });

  const checkDate = (
    date: Date | undefined,
    allowUndefined?: boolean
  ): boolean => {
    if (allowUndefined && !date) {
      return true;
    }

    if (_options.adapter!.isValid(date)) return true;
    else throw new Error("The provided date is invalid");
  };
  const isDateSelected = (date: Date): boolean => {
    if (!_options.selected || !checkDate(date)) return false;

    switch (_options.selectType) {
      case "single":
        return _options.adapter!.isSameDay(date, _options.selected);
      case "multiple":
        return _options.selected.some((d) =>
          _options.adapter!.isSameDay(date, d)
        );
      case "range":
        return isWithinRange(date);
      default:
        return false;
    }
  };

  const isDateDisabled = (date: Date): boolean => {
    if (!_options.disabled || _options.disabled.length < 1 || !checkDate(date))
      return false;

    return (
      _options.disabled.findIndex((d: Date) =>
        _options.adapter!.isSameDay(date, d)
      ) > -1
    );
  };

  const isWithinRange = (date: Date): boolean => {
    if (!_options.selected || !checkDate(date)) return false;

    const selected = _options.selected as { from: Date; to: Date };
    const interval: [Date, Date] = [
      _options.adapter!.startOfDay(selected.from),
      _options.adapter!.endOfDay(selected.to),
    ];

    return _options.adapter!.isWithinRange(date, interval);
  };

  const dateToDay = (date: Date): DPDay => {
    checkDate(date);

    const isBelowMinDate = _options.minDate
      ? _options.adapter!.isBefore(
          _options.adapter!.startOfDay(date),
          _options.adapter!.startOfDay(_options.minDate)
        )
      : false;

    const isAboveMaxDate = _options.maxDate
      ? _options.adapter!.isAfter(
          _options.adapter!.startOfDay(date),
          _options.adapter!.startOfDay(_options.maxDate)
        )
      : false;

    return {
      date,
      monthindex: _options.adapter!.getDate(date),
      today: _options.adapter!.isSameDay(date, new Date()),
      weekIndex: getWeekIndex(date, _options.adapter!),
      weekName: {
        full: _options.adapter!.format(date, "weekday"),
        short: _options.adapter!.format(date, "weekdayShort"),
      },
      thisMonth: _options.adapter!.isSameMonth(date, new Date()),
      selected: isDateSelected(date),
      disabled:
        _options.disabled?.some((d) => _options.adapter!.isSameDay(d, date)) ||
        false,
      belowMin: isBelowMinDate,
      aboveMax: isAboveMaxDate,
    };
  };

  const datesToWeeks = (dates: Date[]): DPWeek[] => {
    dates.every((date) => checkDate(date));
    const daysByWeeks = dates.reduce((acc: DPDay[][], date) => {
      const weekNumber = getWeekIndex(date, _options.adapter!);
      const day: DPDay = dateToDay(date);

      if (!acc[weekNumber - 1]) acc[weekNumber - 1] = [];
      acc[weekNumber - 1].push(day);

      return acc;
    }, []);

    return daysByWeeks.map((days) => ({
      days: days,
      number: getWeekIndex(days[0].date, _options.adapter!),
    }));
  };

  const getMonthOfDate = (date: Date): DPMonth => {
    checkDate(date);
    const monthStart = _options.adapter!.startOfMonth(date),
      monthEnd = _options.adapter!.endOfMonth(date);

    const allDays = getEachDayOfInterval(
      monthStart,
      monthEnd,
      _options.adapter!
    );
    const weeks: DPWeek[] = datesToWeeks(allDays);

    // Code to ensure equal weeks, if applicable
    if (_options.equalWeeks) {
      if (weeks[0].days.length < 7) {
        const diff = 7 - weeks[0].days.length;
        const startDate = weeks[0].days[0].date;

        for (let index = 1; index <= diff; index++) {
          weeks[0].days.unshift(
            dateToDay(_options.adapter!.addDays(startDate, index * -1))
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
            dateToDay(_options.adapter!.addDays(startDate, index))
          );
        }
      }
    }

    const sampleDate = allDays[0];
    const month: DPMonth = {
      weeks: weeks,
      name: {
        full: _options.adapter!.format(sampleDate, "month"),
        short: _options.adapter!.format(sampleDate, "monthShort"),
      },
      number: _options.adapter!.getMonth(sampleDate) + 1,
      year: _options.adapter!.getYear(sampleDate),
    };

    return month;
  };

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

  const currentYear = computed<number>({
    get() {
      return state.currentYear;
    },
    set(year: number) {
      state.currentYear = year;
    },
  });

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

  const minDate = computed<Date | undefined>({
    get() {
      return state.minDate;
    },
    set(date?: Date) {
      checkDate(date, true);
      state.minDate = date;
    },
  });

  const maxDate = computed<Date | undefined>({
    get() {
      return state.maxDate;
    },
    set(date?: Date) {
      checkDate(date, true);
      state.maxDate = date;
    },
  });

  // Return all functions as an object
  return {
    options: _options,
    state,
    getMonthOfDate,
    currentMonth,
    currentYear,
    selected,
    isDateSelected,
    disabled,
    minDate,
    maxDate,
    isDateDisabled,
  };
}
