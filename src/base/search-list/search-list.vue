<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li @click="selectItem(item)" class="search-item" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span @click.stop="deleteOne(item)" class="icon">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'search-list',
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    data() {
      return {}
    },
    components: {},
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px

      .text
        flex: 1
        color: $color-text-l

      .icon
        extend-click()

        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
