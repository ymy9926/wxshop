<template>
  <div class='goods'>
    <div class='menu-warpper'>
      <ul>
        <li v-for='(item,$index) in goods' :key='$index' class='menu-item border-1px'>
          <span class='text'>
            <span v-show='item.type>0' class='icon' :class='classMap[item.type]'></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class='goods-warpper'>
        <ul>
            <li v-for="(item,$index) in goods" :key="$index" class="food-list">
                <h1 class="title">{{item.name}}</h1>
                <ul>
                    <li v-for="(food,$index) in item.foods" :key="$index">
                        <div class="icon">
                            <img :src="food.icon" />
                        </div>
                        <div class="content">
                            <h1 class="name">{{food.name}}</h1>
                            <p class="description">{{food.description}}</p>
                            <div class="extra">
                                <span class="sellCount">月售{{food.sellCount}}份</span>
                                <span class="">好评率{{food.rating}}%</span>
                            </div>
                            <div class="price">
                                <span>￥{{food.price}}</span>
                                <span v-show="food.oldPrice">{{food.oldPrice}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
const ERR_OK = 0;
export default {
  data() {
    return {
      goods: [],
      classMap: []
    };
  },
  props: {
    seller: {
      type: Object
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    this.$http.get('api/goods').then(response => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
      }
      console.log(this.goods);
    });
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
      border-1px(regb(7, 17, 27, 0.1));

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
  }
}
</style>
