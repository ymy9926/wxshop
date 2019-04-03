<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
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
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {};
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
    }
  },
  components: {}
};
</script>

<style scoped lang="stylus">
.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 48px;
  width: 100%;
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
            color: #808508;

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
}
</style>
