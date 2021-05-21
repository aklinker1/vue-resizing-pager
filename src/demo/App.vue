<template>
  <div class="app">
    <div class="row">
      <button @click="toggleShowing()">Show/Hide</button>
      <button @click="setPage(1)">Page 1</button>
      <button @click="setPage(2)">Page 2</button>
      <button @click="setPage(3)">Page 3</button>
    </div>
    <div class="outer-container">
      <resizing-pager v-if="isShowing" :page="page">
        <template #1>
          <div class="page-1">page 1</div>
        </template>
        <template #2>
          <div class="page-2">page 2</div>
        </template>
        <template #3>
          <div class="page-3">page 3</div>
        </template>
      </resizing-pager>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ResizingPager from "../lib/ResizingPager";

export default defineComponent({
  name: "App",
  components: { ResizingPager },
  setup() {
    const page = ref(1);
    const setPage = (newPage: number) => {
      page.value = newPage;
    };

    const isShowing = ref(true);
    const toggleShowing = () => {
      isShowing.value = !isShowing.value;
    };

    return {
      page,
      setPage,
      isShowing,
      toggleShowing,
    };
  },
});
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

.app {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: start;
}

.row {
  display: flex;
  gap: 8px;
}

.outer-container {
  border: 2px solid black;
  margin: 16px;
}

.page-1 {
  color: white;
  background-color: blue;
  width: 100px;
  height: 200px;
}

.page-2 {
  color: white;
  background-color: red;
  width: 200px;
  height: 100px;
}

.page-3 {
  background-color: yellow;
  width: 200px;
  height: 200px;
}
</style>
