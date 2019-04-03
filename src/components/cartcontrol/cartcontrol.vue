<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
        <span class="inner iconfont icon-remove-circle-outlin"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>

    <div class="cart-add" @click="addCart">
      <i class="iconfont icon-addcircle"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from "vue";
export default {
  data() {
    return {};
  },
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart(event) {
      if (!this.food.count) {
        Vue.set(this.food, "count", 1);
        this.food.count = 1;
      } else {
        this.food.count++;
      }
    },
    decreaseCart(event) {
      if (this.food.count) {
        this.food.count--;
      }
    }
  },
  components: {}
};
</script>

<style scoped lang="stylus">
.cartcontrol {
  font-size: 0;

  .cart-decrease {
    display: inline-block;
    padding: 6px;
    transition: all 0.4s linear;
    box-sizing: border-box;
    font-size: 24px;
    color: rgb(0, 160, 220);

    &.move-enter-active, .move-leave-active {
      opacity: 1;
      transform: translate3d(0, 0, 0);

      .inner {
        display: inline-block;
        line-height: 24px;
        transition: all 0.4s linear;
      }
    }

    &.move-enter, &.move-leave-to {
      opacity: 0;
      transition: translate3d(24px, 0, 0);
    }
  }

  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    font-size: 10px;
    text-align: center;
    line-height: 24px;
    height: 24px;
    box-sizing: border-box;
  }

  .cart-add {
    display: inline-block;
    padding: 6px;
    color: rgb(0, 160, 220);
    font-size: 24px;
    box-sizing: border-box;
  }
}
</style>

