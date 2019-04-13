<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleShow">
          <div class="logo-warpper">
            <div class="logo" :class="{'highlight':totalFoods>0}">
              <span class="iconfont icon-cart" :class="{'highlight':totalFoods>0}"></span>
              <div class="num" v-show="totalFoods>0">{{totalFoods}}</div>
            </div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-rigth">
          <div class="pay" :class="payClass" @click="pay">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <transition
          v-for="(ball,$index) in balls"
          :key="$index"
          name="drop"
          v-on:before-enter="beforeEnter"
          v-on:enter="enter"
          v-on:after-enter="afterEnter"
        >
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <div class="shopcart-list" ref="myfoldlist">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="(food,$key) in selectFoods" :key="$key">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-warpper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="!foldlist" @click="hideList"></div>
    </transition>
  </div>
</template>                                                                      

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import cartcontrol from "../cartcontrol/cartcontrol";
export default {
  data() {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true,
      foldlist: true
    };
  },
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [{ price: 10, count: 10 }];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    totalPrice() {
      var total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    totalFoods() {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.count;
      });
      if (total == 0) {
        this.foldlist = true;
        if (this.$refs.myfoldlist) {
          this.$refs.myfoldlist.style.transform = "translate3d(0,0,0)";
        }
      }
      return total;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      } else {
        return "去结算";
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return "not-enough";
      } else {
        return "enough";
      }
    },
    listShow() {
      if (this.totalFoods === 0) {
        this.fold = true;
        return false;
      } else {
        return !this.fold;
      }
    }
  },
  methods: {
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = "";
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(el) {
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        el.style.webkitTransform = "translate3d(0,0,0)";
        el.style.transform = "translate3d(0,0,0)";
        let inner = el.getElementsByClassName("inner-hook")[0];
        inner.style.webkitTransform = "translate3d(0,0,0)";
        inner.style.transform = "translate3d(0,0,0)";
      });
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    },
    toggleShow() {
      if (!this.totalFoods) {
        this.foldlist = true;
      } else {
        this.foldlist = !this.foldlist;
      }
      if (!this.foldlist) {
        this.$refs.myfoldlist.style.transform = "translate3d(0,-100%,0)";
        if (!this.cartscroll) {
          this.cartscroll = new BScroll(this.$refs.listContent, {
            click: true
          });
        } else {
          this.cartscroll.refresh();
        }
      } else {
        this.$refs.myfoldlist.style.transform = "translate3d(0,0,0)";
      }
    },
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0;
      });
      this.foldlist = true;
      this.$refs.myfoldlist.style.transform = "translate3d(0,0,0)";
    },
    hideList() {
      this.foldlist = true;
      this.$refs.myfoldlist.style.transform = "translate3d(0,0,0)";
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      window.alert(`需要支付${this.totalPrice}元`);
    }
  },
  components: {
    cartcontrol
  }
};
</script>

<style lang="stylus" rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';

.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 48px;
  width: 100%;
  z-index: 50;
  background-color: #000;

  .content {
    display: flex;
    background: #141d27;
    color: rgba(255, 255, 255, 0.4);

    .content-left {
      flex: 1;

      .logo-warpper {
        display: inline-block;
        width: 56px;
        height: 56px;
        margin: 0 12px;
        padding: 6px;
        position: relative;
        top: -10px;
        border-radius: 50%;
        box-sizing: border-box;
        background-color: #141d27;
        vertical-align: top;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          text-align: center;
          background: #2b343c;

          &.highlight {
            background: rgb(0, 160, 220);
          }

          .icon-cart {
            line-height: 44px;
            font-size: 24px;
            color: #999;

            &.highlight {
              color: #fff;
            }
          }

          .num {
            position: absolute;
            top: 0px;
            right: 0px;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            font-size: 9px;
            font-weight: 700;
            background: rgb(240, 20, 20);
            border-radius: 16px;
            color: #fff;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          }
        }
      }

      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.4);

        &.highlight {
          color: #fff;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: 10px;
      }
    }

    .content-rigth {
      flex: 0 0 105px;
      width: 105px;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        background: #2b333b;

        &.not-enough {
          background: #2b333b;
        }

        &.enough {
          background: #00bc3c;
          color: #fff;
        }
      }
    }
  }

  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

      .inner {
        width: 16px;
        height: 16px;
        background: rgb(0, 160, 220);
        border-radius: 50%;
        transition: all 0.4s linear;
      }
    }
  }

  .shopcart-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    transition: all 0.5s;

    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }

    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;

      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        border-1px(rgba(7, 17, 27, 0.1));

        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }

        .cartcontrol-warpper {
          position: absolute;
          right: 0px;
          bottom: 6px;
        }
      }
    }
  }
}

.list-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  transition: all 0.5s;
  background: rgba(7, 17, 27, 0.6);

  &.fade-transition {
    opacity: 1;
  }

  &.fade-enter, &.fade-leave-active {
    opacity: 0;
  }
}
</style>
