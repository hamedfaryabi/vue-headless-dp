<script lang="ts" setup>
import DateFnsAdapter from "@date-io/date-fns";
import { format } from "date-fns";
import { computed } from "vue";
import { useHeadlessDatePicker } from ".";

const adapter = new DateFnsAdapter();

const { currentYear, currentMonth } = useHeadlessDatePicker(adapter, {
  selectType: "single",
  equalWeeks: true,
  minDate: new Date(),
});

// dp.selected.value = new Date();

const month = computed(() => {
  return `${currentYear.value} ${currentMonth.value.name.full}`
})

// console.log(month.value);
</script>

<template>
  <div style="display:flex; gap: 16px; flex-direction: column;">
    {{ month }}
    <div style="display: flex; gap: 14px">
      <span v-for="day in adapter.getWeekdays()">
        {{ day }}
      </span>
    </div>
    <div v-for="week in currentMonth.weeks" style="display: flex; gap: 16px">
      <span v-for="day in week.days">
        {{ format(day.date, "dd") }}
      </span>
    </div>
  </div>
</template>
