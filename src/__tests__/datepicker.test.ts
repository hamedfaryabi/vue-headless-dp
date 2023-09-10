import { useHeadlessDatePicker } from "./../useHeadlessDatePicker";

describe("useHeadlessDatePicker", () => {
  it("should select a single date", () => {
    const dp = useHeadlessDatePicker();

    // Set a selected date
    const selectedDate = new Date("2023-09-10");
    dp.setSelected(selectedDate);

    // Assert that the selected date is set correctly
    expect(dp.getSelected()).toEqual(selectedDate);
  });

  it("should select multiple dates", () => {
    const dp = useHeadlessDatePicker({ selectType: "multiple" });

    // Set selected dates as an array
    const selectedDates = [new Date("2023-09-10"), new Date("2023-09-11")];
    dp.setSelected(selectedDates);

    // Assert that the selected dates are set correctly
    expect(dp.getSelected()).toEqual(selectedDates);
  });

  it("should select a date range", () => {
    const dp = useHeadlessDatePicker({ selectType: "range" });

    // Set a date range object
    const dateRange = {
      from: new Date("2023-09-10"),
      to: new Date("2023-09-15"),
    };
    dp.setSelected(dateRange);

    // Assert that the date range is set correctly
    expect(dp.getSelected()).toEqual(dateRange);
  });

  it("should set and check disabled dates", () => {
    const dp = useHeadlessDatePicker({ selectType: "range" });

    // Set disabled dates
    const disabledDates = [new Date("2023-09-12"), new Date("2023-09-13")];
    dp.setDisabled(disabledDates);

    // Check if disabled dates are correctly identified
    expect(dp.isDateDisabled(new Date("2023-09-12"))).toBe(true);
    expect(dp.isDateDisabled(new Date("2023-09-14"))).toBe(false);
  });
});
