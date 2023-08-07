<script lang="ts" setup>
import { useHeadlessDatePicker } from ".";

const dp = useHeadlessDatePicker({
  weekStart: 6,
  selectType: "single",
  equalWeeks: false,
});

dp.setDisabled(new Date());

console.log(dp.getCalendarMonth());
</script>

<template>
  <div>hi</div>
</template>

