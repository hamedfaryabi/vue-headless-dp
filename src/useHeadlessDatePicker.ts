import type { DPDay, DPMonth, DPOptions, DPWeek } from "./datepicker";

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDate,
  getMonth,
  getWeekOfMonth,
  getYear,
  isToday,
  startOfMonth,
  isThisMonth,
  subDays,
  addDays,
  isSameDay,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from "date-fns";
import { defu } from "defu";

export function useHeadlessDatePicker(options?: DPOptions) {
  let _options: DPOptions = {
    weekStart: 1, // monday
    initialMonth: undefined,
    initialYear: undefined,
    equalWeeks: true,
    selected: undefined,
    selectType: "single",
  };

  _options = defu(options, _options) as DPOptions;

  const isDateSelected = (date: Date): boolean => {
    if (_options.selected) {
      switch (_options.selectType) {
        case "single":
          return isSameDay(date, _options.selected);
        case "multiple":
          return _options.selected.some((d) => isSameDay(date, d));
        case "range":
          const interval = {
            start: startOfDay(_options.selected.from),
            end: endOfDay(_options.selected.to),
          };
          return isWithinInterval(date, interval);
        default:
          return false;
      }
    } else {
      return false;
    }
  };

  const dateToDay = (date: Date): DPDay => {
    const weekIndex = +format(date, "c", {
      weekStartsOn: _options.weekStart,
    });

    return {
      date,
      weekIndex,
      monthindex: getDate(date),
      today: isToday(date),
      weekName: {
        fullName: format(date, "EEEE", {
          weekStartsOn: _options.weekStart,
        }),
      },
      inMonth: isThisMonth(date),
      selected: isDateSelected(date),
    };
  };

  const datesToWeeks = (dates: Date[]) => {
    const daysByWeeks = dates.reduce((acc: DPDay[][], date) => {
      const weekNumber = getWeekOfMonth(date, {
        weekStartsOn: _options.weekStart,
      });
      const day: DPDay = dateToDay(date);

      if (!acc[weekNumber - 1]) acc[weekNumber - 1] = [];
      acc[weekNumber - 1].push(day);

      return acc;
    }, []);

    return daysByWeeks.map((days) => ({
      days: days,
      number: getWeekOfMonth(days[0].date, {
        weekStartsOn: _options.weekStart,
      }),
    }));
  };

  const getMonthOfDate = (date: Date | number): DPMonth => {
    const monthStart = startOfMonth(date),
      monthEnd = endOfMonth(date);

    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const weeks: DPWeek[] = datesToWeeks(allDays);
    if (_options.equalWeeks) {
      if (weeks[0].days.length < 7) {
        const diff = 7 - weeks[0].days.length;
        const startDate = weeks[0].days[0].date;

        for (let index = 1; index <= diff; index++) {
          weeks[0].days.unshift(dateToDay(subDays(startDate, index)));
        }
      }

      const weeksLastIndex = weeks.length - 1;
      if (weeks[weeksLastIndex].days.length < 7) {
        const daysLength = weeks[weeksLastIndex].days.length;
        const diff = 7 - daysLength;
        const startDate = weeks[weeksLastIndex].days[daysLength - 1].date;

        for (let index = 1; index <= diff; index++) {
          weeks[weeksLastIndex].days.push(dateToDay(addDays(startDate, index)));
        }
      }
    }

    const sampleDate = allDays[0];
    const month: DPMonth = {
      weeks: weeks,
      name: {
        fullName: format(sampleDate, "MMMM", {
          weekStartsOn: _options.weekStart,
        }),
      },
      number: getMonth(sampleDate) + 1,
      year: getYear(sampleDate),
    };

    return month;
  };

  const getCurrentMonth = (): DPMonth => {
    return getMonthOfDate(new Date());
  };

  const getCalendarMonth = (): DPMonth => {
    const d = new Date();
    if (_options.initialYear) {
      d.setFullYear(_options.initialYear);
    }
    if (_options.initialMonth) {
      d.setMonth(_options.initialMonth - 1);
    }

    return getMonthOfDate(d);
  };

  const setMonth = (month: DPOptions["initialMonth"]): void => {
    _options.initialMonth = month;
  };

  const setYear = (year: DPOptions["initialYear"]): void => {
    _options.initialYear = year;
  };

  const setMonthYear = (
    month: DPOptions["initialMonth"],
    year: DPOptions["initialYear"]
  ): void => {
    _options.initialMonth = month;
    _options.initialYear = year;
  };

  const setSelected = (date: DPOptions["selected"]) => {
    if (date) {
      switch (_options.selectType) {
        case "single":
          if (!(date instanceof Date)) {
            throw new Error("Invalid date format for 'single' selectType");
          }
          _options.selected = date;
          break;
        case "multiple":
          if (!Array.isArray(date) || !date.every((d) => d instanceof Date)) {
            throw new Error("Invalid date format for 'multiple' selectType");
          }
          _options.selected = date;
          break;
        case "range":
          if (
            !("from" in date) ||
            !("to" in date) ||
            !(date.from instanceof Date) ||
            !(date.to instanceof Date)
          ) {
            throw new Error("Invalid date format for 'range' selectType");
          }
          _options.selected = date;
          break;
        default:
          throw new Error(`invalid selectType: ${_options.selectType}`);
          break;
      }
    }
  };

  const getSelected = (): DPOptions["selected"] => {
    return _options.selected;
  };

  return {
    getMonthOfDate,
    getCurrentMonth,
    getCalendarMonth,
    setMonth,
    setYear,
    setMonthYear,
    setSelected,
    getSelected,
    isDateSelected,
  };
}
