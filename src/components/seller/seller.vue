<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>
              <span class="unit">元</span>
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>
              <span class="unit">元</span>
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>
              <span class="unit">分钟</span>
            </div>
          </li>
        </ul>
        <div class="favorite" @click="favoriteClick">
          <span class="iconfont icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-warpper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li
            class="supports-item border-1px"
            v-for="(item,$index) in seller.supports"
            :key="$index"
          >
            <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-warpper" ref="picwarpper">
          <ul class="pic-list" ref="piclist">
            <li class="pic-item" v-for="item in seller.pics">
              <img :src="item" alt width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <div class="title border-1px">商家信息</div>
        <ul>
          <li class="info-item border-1px" v-for="item in seller.infos">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { saveToLocal, loadFromLocal } from "../../common/js/store";
import BScroll from "better-scroll";
import split from "../split/split";
import star from "../star/star";
export default {
  data() {
    return {
      favorite: false
    };
  },
  props: {
    seller: {
      type: Object,
      default: {}
    }
  },
  watch: {
    seller() {
      this._picScroll();
    }
  },
  computed: {
    favoriteText() {
      return this.favorite ? "已收藏" : "收藏";
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "guarantee", "invoice", "special"];
    console.log(1);
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.seller, { click: true });
      this.favorite = loadFromLocal(this.seller.id, "favorite", false);
    });
  },
  components: {
    star,
    split
  },
  methods: {
    _picScroll() {
      if (this.seller.pics) {
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;

        this.$nextTick(() => {
          this.$refs.piclist.style.width = width + "px";
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picwarpper, {
              scrollX: true,
              click: true,
              eventPassthrough: "vertical"
            });
          } else {
            this.picScroll.refresh();
          }
        });
      }
    },
    favoriteClick() {
      this.favorite = !this.favorite;
      saveToLocal(this.seller.id, "favorite", this.favorite);
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../common/stylus/mixin.styl';

.seller {
  position: absolute;
  top: 174px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;

  .seller-content {
    .overview {
      padding: 18px;
      position: relative;

      .title {
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        margin-bottom: 8px;
      }

      .desc {
        padding-bottom: 18px;
        font-size: 0;
        border-1px(rgba(7, 17, 27, 0.1));

        .star {
          font-size: 18px;
          line-height: 18px;
          display: inline-block;
          vertical-align: top;
        }

        .text {
          display: inline-block;
          margin-left: 12px;
          font-size: 10px;
          line-height: 18px;
          color: rgb(77, 85, 93);
          vertical-align: top;
        }
      }

      .remark {
        padding-top: 18px;
        display: flex;

        .block {
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7, 17, 27, 0.1);
          font-size: 0;

          &:last-child {
            border-right: 0;
          }

          h2 {
            font-size: 10px;
            line-height: 10px;
            color: rgb(147, 153, 159);
            margin-bottom: 4px;
          }

          .stress {
            font-size: 24px;
            line-height: 24px;
            color: rgb(7, 17, 27);
          }

          .unit {
            font-size: 10px;
            color: rgb(77, 85, 93);
          }
        }
      }

      .favorite {
        position: absolute;
        text-align: center;
        right: 18px;
        top: 16px;
        width: 40px;
        color: #d7d4d9;

        .icon-favorite {
          display: block;
          margin-bottom: 6px;
          font-size: 24px;
          line-height: 24px;

          &.active {
            color: rgb(240, 20, 20);
          }
        }

        .text {
          display: block;
          font-size: 10px;
          line-height: 10px;
          color: rgb(77, 85, 93);
        }
      }
    }

    .bulletin {
      padding: 18px 18px 0 18px;

      .title {
        font-size: 14px;
        line-height: 14px;
        margin-bottom: 8px;
      }

      .content-warpper {
        padding: 0 12px 16px 12px;
        border-1px(rgba(7, 17, 27, 0.1));

        .content {
          font-size: 12px;
          line-height: 24px;
          color: rgb(240, 20, 20);
        }
      }

      .supports {
        .supports-item {
          padding: 16px 12px;
          border-1px(rgba(7, 17, 27, 0.1));
          font-size: 0;

          &:last-child {
            border: none;
          }

          .icon {
            display: inline-block;
            vertical-align: top;
            width: 16px;
            height: 16px;
            margin-right: 4px;
            background-size: 16px 16px;
            background-repeat: no-repeat;

            &.decrease {
              bg-image('decrease_4');
            }

            &.discount {
              bg-image('discount_4');
            }

            &.guarantee {
              bg-image('guarantee_4');
            }

            &.invoice {
              bg-image('invoice_4');
            }

            &.special {
              bg-image('special_4');
            }
          }

          .text {
            vertical-align: top;
            line-height: 16px;
            font-size: 12px;
          }
        }
      }
    }

    .pics {
      padding: 18px;

      .title {
        font-size: 14px;
        line-height: 14px;
        margin-bottom: 12px;
      }

      .pic-warpper {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;

        .pic-list {
          font-size: 0;

          .pic-item {
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90px;

            &:last-child {
              margin: 0;
            }
          }
        }
      }
    }

    .info {
      padding: 18px;

      .title {
        font-size: 14px;
        line-height: 14px;
        padding-bottom: 12px;
        border-1px(rgba(7, 17, 27, 0.1));
      }

      .info-item {
        padding: 16px 12px;
        font-size: 12px;
        line-height: 16px;
        border-1px(rgba(7, 17, 27, 0.1));
        border-none();
      }
    }
  }
}
</style>

