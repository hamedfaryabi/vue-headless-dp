<script lang="ts" setup>
import { useHeadlessDatePicker } from ".";

const dp = useHeadlessDatePicker({
  weekStart: 6,
  selectType: "range",
});

const to = new Date();
to.setFullYear(2023, 11);
dp.setSelected({
  from: new Date(),
  to,
});
console.log(dp.getCalendarMonth());
</script>

<template>
  <div>hi</div>
</template>

