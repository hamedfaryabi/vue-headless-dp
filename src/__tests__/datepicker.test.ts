import { useHeadlessDatePicker } from "./../useHeadlessDatePicker";
import DateFnsAdapter from "@date-io/date-fns";
import FaIR from "date-fns/locale/fa-IR";

describe("useHeadlessDatePicker", () => {
  const adapter = new DateFnsAdapter({ locale: FaIR });
  it("should select a single date", () => {
    const { selected } = useHeadlessDatePicker(adapter, {
      selectType: "single",
      equalWeeks: false,
    });

    // Set a selected date
    const selectedDate = new Date("2023-09-10");
    selected.value = selectedDate;

    // Assert that the selected date is set correctly
    expect(selected.value).toEqual(selectedDate);
  });

  it("should select multiple dates", () => {
    const { selected } = useHeadlessDatePicker(adapter, {
      selectType: "multiple",
    });

    // Set selected dates as an array
    const selectedDates = [new Date("2023-09-10"), new Date("2023-09-11")];
    selected.value = selectedDates;

    // Assert that the selected dates are set correctly
    expect(selected.value).toEqual(selectedDates);
  });

  it("should select a date range", () => {
    const { selected } = useHeadlessDatePicker(adapter, {
      selectType: "range",
    });

    // Set a date range object
    const dateRange = {
      from: new Date("2023-09-10"),
      to: new Date("2023-09-15"),
    };
    selected.value = dateRange;

    // Assert that the date range is set correctly
    expect(selected.value).toEqual(dateRange);
  });

  it("should set and check disabled dates", () => {
    const { disabled, isDateDisabled } = useHeadlessDatePicker(adapter, {
      selectType: "range",
    });

    // Set disabled dates
    const disabledDates = [new Date("2023-09-12"), new Date("2023-09-13")];
    disabled.value = disabledDates;

    // Check if disabled dates are correctly identified
    expect(isDateDisabled(new Date("2023-09-12"))).toBe(true);
    expect(isDateDisabled(new Date("2023-09-14"))).toBe(false);
  });
});
