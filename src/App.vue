<script lang="ts" setup>
import { useHeadlessDatePicker } from ".";

const dp = useHeadlessDatePicker({
  calendar: "gregorian",
  weekStart: 6,
  selectType: "single",
  equalWeeks: false,
  minDate: new Date(),
});

dp.setSelected(new Date());

console.log(dp.getCurrentMonth());
dp.options.calendar = "jalali";
setTimeout(() => {
  console.log(dp.getCurrentMonth());
}, 3000);
</script>

<template>
  <div>hi</div>
</template>

