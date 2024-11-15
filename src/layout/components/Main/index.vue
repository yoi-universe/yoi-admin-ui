<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in" appear>
      <KeepAlive>
        <component :is="Component" :key="route.fullPath" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<script lang="ts" setup></script>

<style scoped></style>
