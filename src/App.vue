<script lang="ts" setup>
import { useHeadlessDatePicker } from ".";

const dp = useHeadlessDatePicker({
  weekStart: 6,
  initialMonth: 1,
  initialYear: 2019,
});

console.log(dp.getCalendarMonth());
</script>

<template>
  <div>hi</div>
</template>

