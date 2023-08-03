export interface DPOptions {
  /**
   * Defines start of the week.
   *
   * **0 is sunday**
   *
   * @type {(0 | 1 | 2 | 3 | 4 | 5 | 6)}
   * @memberof DPOptions
   */
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export type DPMonthName = {
  fullName: string;
};

export type DPDPDayInWeekName = {
  fullName: string;
};

export interface DPDay {
  date: Date;
  weekIndex: number;
  monthindex: number;
  today: boolean;
  weekName: DPDPDayInWeekName;
}

export interface DPWeek {
  days: DPDay[];
  number: number;
}

export interface DPMonth {
  name: DPMonthName;
  number: number;
  weeks: DPWeek[];
  year: number;
}
