<template>
  <el-config-provider :locale="zhCn">
    <NuxtPage />
  </el-config-provider>
  
</template>

<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>
