<template>
  <div class="goods">
    <div class="menu-warpper" ref="menuWarpper">
      <ul>
        <li
          v-for="(item,$index) in goods"
          :key="$index"
          class="menu-item border-1px"
          :class="{'current':currentIndex===$index}"
          @click="selectMenu($index,$event)"
        >
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="goods-warpper" ref="foodsWarpper">
      <ul>
        <li v-for="(item,$index) in goods" :key="$index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food,$index) in item.foods" :key="$index" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h1 class="name">{{food.name}}</h1>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span class>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">{{food.oldPrice}}</span>
                </div>
                <div class="cartcontroll-warpper">
                  <cartcontrol @cart-add="_drop" :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart
      ref="shopcart"
      :select-foods="selectFoods"
      :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice"
    ></shopcart>
  </div>
</template>

<script type='text/ecmascript-6'>
import BScroll from "better-scroll";
import shopcart from "../shopcart/shopcart";
import cartcontrol from "../cartcontrol/cartcontrol";
const ERR_OK = 0;
export default {
  components: {
    shopcart,
    cartcontrol
  },
  data() {
    return {
      goods: [],
      classMap: [],
      listHeight: [],
      scrollY: 0
    };
  },
  props: {
    seller: {
      type: Object
    }
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let heigth1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (heigth1 <= this.scrollY && height2 > this.scrollY)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      var foods = [];
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "guarantee", "invoice", "special"];
    this.$http.get("api/goods").then(response => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
  },
  methods: {
    selectMenu: function(index, event) {
      if (!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodsWarpper.getElementsByClassName(
        "food-list-hook"
      );
      let food = foodList[index];
      this.foodsScroll.scrollToElement(food, 300);
    },
    _initScroll: function() {
      this.menuScroll = new BScroll(this.$refs.menuWarpper, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWarpper, {
        click: true,
        probeType: 3
      });
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight: function() {
      var list = this.$refs.foodsWarpper.getElementsByClassName(
        "food-list-hook"
      );
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight;
        this.listHeight.push(height);
      }
    },
    _drop(target) {
      //体验优化，异步下落
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    }
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';

.goods {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  .menu-warpper {
    flex: 0 0 80px;
    width: 80px;
    background-color: #f3f5f7;

    .menu-item {
      display: table;
      width: 56px;
      height: 46px;
      line-height: 14px;
      padding: 0 12px;
      border-1px(rgba(7, 17, 27, 0.1));

      &.current {
        position: relative;
        background-color: #fff;
        z-index: 10;
        margin-top: -1px;
        font-weight: 700;

        .text {
          border-none();
        }
      }

      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease {
          bg-image('decrease_3');
        }

        &.discount {
          bg-image('discount_3');
        }

        &.guarantee {
          bg-image('guarantee_3');
        }

        &.invoice {
          bg-image('invoice_3');
        }

        &.special {
          bg-image('special_3');
        }
      }

      .text {
        display: table-cell;
        width: 56px;
        font-size: 12px;
        vertical-align: middle;
      }
    }
  }

  .goods-warpper {
    flex: 1;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .food-item {
      display: flex;
      padding: 18px;
      border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;
        position: relative;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .desc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          line-height: 12px;
          margin-bottom: 8px;
        }

        .extra {
          .count {
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

        .cartcontroll-warpper {
          position: absolute;
          right: 0px;
          bottom: 0px;
        }
      }
    }
  }
}
</style>
