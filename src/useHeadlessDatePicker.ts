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
} from "date-fns";
import { defu } from "defu";

export function useHeadlessDatePicker(options?: DPOptions) {
  let _options: Required<DPOptions> = {
    weekStart: 0,
  };

  _options = defu(options, _options);
  const dateToDay = (date: Date): DPDay => {
    return {
      date: date,
      weekIndex: +format(date, "i", {
        weekStartsOn: _options.weekStart,
      }),
      monthindex: getDate(date),
      today: isToday(date),
      weekName: {
        fullName: format(date, "EEEE", {
          weekStartsOn: _options.weekStart,
        }),
      },
    };
  };

  const getMonthOfDate = (date: Date | number): DPMonth => {
    const monthStart = startOfMonth(date),
      monthEnd = endOfMonth(date);

    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const daysByWeeks = allDays.reduce((acc: DPDay[][], date) => {
      const weekNumber = getWeekOfMonth(date, {
        weekStartsOn: _options.weekStart,
      });
      const day: DPDay = dateToDay(date);

      if (!acc[weekNumber - 1]) acc[weekNumber - 1] = [];
      acc[weekNumber - 1].push(day);

      return acc;
    }, []);

    const weeks: DPWeek[] = daysByWeeks.map((days) => ({
      days: days,
      number: getWeekOfMonth(days[0].date, {
        weekStartsOn: _options.weekStart,
      }),
    }));

    const sampleDate = allDays[0];
    const month: DPMonth = {
      weeks: weeks,
      name: {
        fullName: format(sampleDate, "MMMM", {
          weekStartsOn: _options.weekStart,
        }),
      },
      number: getMonth(sampleDate),
      year: getYear(sampleDate),
    };

    return month;
  };

  const getCurrentMonth = (): DPMonth => {
    return getMonthOfDate(new Date());
  };

  return {
    getMonthOfDate,
    getCurrentMonth,
  };
}
