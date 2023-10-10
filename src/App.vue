<script lang="ts" setup>
import { useHeadlessDatePicker } from ".";
import DateFnsAdapter from "@date-io/date-fns";

const adapter = new DateFnsAdapter();

const dp = useHeadlessDatePicker(adapter, {
  selectType: "single",
  equalWeeks: false,
  minDate: new Date(),
});

dp.selected.value = new Date();

console.log(dp.currentYear.value);
</script>

<template>
  <div>hi</div>
</template>

