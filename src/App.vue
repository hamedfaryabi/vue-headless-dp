<script lang="ts" setup>
import { useHeadlessDatePicker } from ".";

const dp = useHeadlessDatePicker({
  weekStart: 6,
});

dp.setSelected(new Date());
console.log(dp.getCalendarMonth());
</script>

<template>
  <div>hi</div>
</template>

