<script lang="ts" setup>
import { useHeadlessDatePicker } from ".";

const dp = useHeadlessDatePicker({
  weekStart: 6,
});

console.log(dp.getCalendarMonth());
</script>

<template>
  <div>hi</div>
</template>

