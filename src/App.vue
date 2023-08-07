<script lang="ts" setup>
import { useHeadlessDatePicker } from ".";

const dp = useHeadlessDatePicker({
  weekStart: 6,
  selectType: "single",
  equalWeeks: false,
  minDate: new Date(),
});

dp.setDisabled(new Date());

console.log(dp.getCalendarMonth().weeks[1].days[3].weekName);
</script>

<template>
  <div>hi</div>
</template>

