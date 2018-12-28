<template>
  <ul class="switches">
    <li class="switch-item"
        v-for="(item,index) in switches"
        :class="{'active':currentIndex === index}"
        @click="switchItem(index)"
    >
      <span>{{item.name}} </span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'switches',
    props: {
      //选项
      switches: {
        type: Array,
        default: []
      },
      //当前所在选项
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {}
    },
    components: {},
    methods: {
      //选择选项
      switchItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px

    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d

      &.active
        background: $color-highlight-background
        color: $color-text
</style>
