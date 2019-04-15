<template>
  <transition name="move">
    <div class="food" v-show="foodFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt>
          <div class="back" @click="back">
            <i class="iconfont icon-Left"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <div class="sell-count">月售{{food.sellCount}}份</div>
            <div class="rating">好评率{{food.rating}}</div>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-warpper">
            <cartcontrol :food="food" @cart-add="_drop"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop="addFirt" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info">
          <h1 class="title" v-show="food.info">商品信息</h1>
          <p>{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect
            :ratings="food.ratings"
            :select-type="selectType"
            :only-content="onlyContent"
            :desc="desc"
            @rating-select="ratingSelect"
            @toggle-content="toggleContent"
          ></ratingselect>
          <div class="rating-warpper">
            <ul v-show="food.ratings && food.ratings.length > 0" class="rating-list">
              <li
                class="rating-item"
                v-show="needShow(rating.rateType,rating.text)"
                v-for="rating in food.ratings"
              >
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" alt width="16" height="16" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formartDate}}</div>
                <p class="text">
                  <i
                    class="iconfont"
                    :class="{'icon-thumb-up':rating.rateType === 0,'icon-thumb-down':rating.rateType === 1}"
                  ></i>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div v-show="!food.ratings || food.ratings.length === 0" class="no-rating">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Vue from "vue";
import { formartDate } from "../../common/js/date";
import BScroll from "better-scroll";
import cartcontrol from "../cartcontrol/cartcontrol";
import split from "../split/split";
import ratingselect from "../ratingselect/ratingselect";
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  data() {
    return {
      foodFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: "全部",
        positive: "推荐",
        negative: "吐槽"
      }
    };
  },
  props: {
    food: {
      type: Object
    }
  },
  filters: {
    formartDate(time) {
      var date = new Date(time);
      return formartDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  methods: {
    show() {
      this.foodFlag = true;
      console.log(this.selectType);
      this.selectType = POSITIVE;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, { click: true });
        } else {
          this.scroll.refresh();
        }
        this.$refs;
      });
    },
    back() {
      this.foodFlag = false;
    },
    addFirt(event) {
      if (!this.food.count) {
        this.$emit("cart-add", event.target);
        Vue.set(this.food, "count", 1);
      }
    },
    _drop(el) {
      this.$emit("cart-add", el);
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return this.selectType === type;
      }
    },
    ratingSelect(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    toggleContent(isToggle) {
      this.onlyContent = isToggle;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  }
};
</script>

<style scoped lang="stylus">
@import '../../assets/iconfont.css';
@import '../../common/stylus/mixin.styl';

.food {
  position: fixed;
  left: 0;
  top: 0;
  margin-bottom: 48px;
  width: 100%;
  height: calc(100% - 48px);
  z-index: 30;
  background: #fff;
  transition: all 0.3s linear;
  transform: translate3d(0, 0, 0);

  &.move-enter-active, &.move-leave-active {
    transform: translate3d(0, 0, 0);
  }

  &.move-enter, &.move-leave-active {
    transform: translate3d(100%, 0, 0);
  }

  .food-content {
    .image-header {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;

      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      .back {
        position: absolute;
        top: 10px;
        left: 0;

        .iconfont {
          display: block;
          padding: 10px;
          font-size: 20px;
          color: #fff;
        }
      }
    }

    .content {
      position: relative;
      padding: 18px;

      .title {
        line-height: 14px;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
      }

      .detail {
        margin-bottom: 18px;
        line-height: 10px;
        font-size: 0px;

        .sell-count, .rating {
          display: inline-block;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .sell-count {
          margin-right: 12px;
        }
      }

      .price {
        font-weight: 700;
        line-height: 24px;

        .now {
          margin-right: 8px;
          font-size: 14px;
          color: rgb(240, 20, 20);
        }

        .old {
          text-decoration: line-through;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
    }

    .cartcontrol-warpper {
      position: absolute;
      right: 12px;
      bottom: 12px;
    }

    .buy {
      position: absolute;
      right: 18px;
      bottom: 18px;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      font-size: 10px;
      box-sizing: border-box;
      color: #fff;
      background: rgb(0, 160, 220);
      border-radius: 24px;
      opacity: 1;
      transition: all 0.3s;

      &.fade-enter-active, &.fade-leave-active {
        opacity: 1;
      }

      &.fade-enter, &.fade-leave-active {
        opacity: 0;
      }
    }

    .info {
      padding: 18px;

      .title {
        line-height: 14px;
        margin-bottom: 6px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      p {
        color: rgb(77, 85, 93);
        padding: 0 8px;
        line-height: 24px;
        font-size: 12px;
      }
    }

    .rating {
      padding-top: 18px;

      .title {
        line-height: 14px;
        margin-left: 18px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .rating-warpper {
        padding: 0 18px;

        .rating-item {
          padding: 16px 0;
          border-1px(rgba(7, 17, 27, 0.1));

          .user {
            position: absolute;
            top: 16px;
            right: 0px;
            font-size: 0;

            .name {
              font-size: 10px;
              vertical-align: top;
              color: rgb(147, 153, 159);
              line-height: 16px;
              margin-right: 6px;
            }

            .avatar {
              vertical-align: top;
              border-radius: 50%;
            }
          }

          .time {
            font-size: 10px;
            color: rgb(147, 153, 159);
            margin-bottom: 6px;
            line-height: 16px;
          }

          .text {
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 16px;

            .icon-thumb-up, .icon-thumb-down {
              margin-right: 4px;
              font-size: 12px;
            }

            .icon-thumb-up {
              color: rgb(0, 160, 220);
            }

            .icon-thumb-down {
              color: rgb(147, 153, 159);
            }
          }
        }
      }

      .no-rating {
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147, 153, 159);
      }
    }
  }
}
</style>
