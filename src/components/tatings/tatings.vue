<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合得分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-warpper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-warpper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-warpper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect
        :ratings="ratings"
        :select-type="selectType"
        :only-content="onlyContent"
        :desc="desc"
        @rating-select="ratingSelect"
        @toggle-content="toggleContent"
      ></ratingselect>
      <div class="ratings-warpper">
        <ul>
          <li class="rating-item border-1px" v-for="rating in ratings" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28" alt>
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-warpper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend.length">
                <span class="iconfont icon-thumb-up"></span>
                <span v-for="item in rating.recommend" class="recommend-item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formartDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import star from "../star/star";
import split from "../split/split";
import ratingselect from "../ratingselect/ratingselect";
import { formartDate } from "../../common/js/date";
const ALL = 2;
const ERR_OK = 0;
export default {
  data() {
    return {
      ratings: [],
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
    seller: {
      type: Object
    }
  },
  filters: {
    formartDate(str) {
      let date = new Date(str);
      return formartDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  components: {
    star,
    split,
    ratingselect
  },
  created() {
    this.$http.get("api/ratings").then(result => {
      result = result.body;
      if (result.errno === ERR_OK) {
        this.ratings = result.data;
        this.$nextTick(() => {
          this.bscroll = new BScroll(this.$refs.ratings, { click: true });
        });
      }
    });
  },
  methods: {
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
        this.bscroll.refresh();
      });
    },
    toggleContent(isToggle) {
      this.onlyContent = isToggle;
      this.$nextTick(() => {
        this.bscroll.refresh();
      });
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../assets/iconfont.css';
@import '../../common/stylus/mixin.styl';

.ratings {
  position: absolute;
  top: 174px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;

  .overview {
    padding: 18px 0;
    display: flex;

    .overview-left {
      flex: 0 0 137px;
      padding: 6px;
      border-right: 1px solid rgba(7, 17, 27, 0.2);
      width: 137px;
      text-align: center;

      @media only screen and (max-width: 320px) {
        flex: 0 0 120px;
        width: 120px;
      }

      .score {
        font-size: 24px;
        line-height: 28px;
        color: rgb(255, 153, 0);
      }

      .title {
        font-size: 12px;
        line-height: 12px;
        color: rgb(7, 17, 27);
        margin-bottom: 8px;
      }

      .rank {
        padding-bottom: 6px;
        font-size: 10px;
        line-height: 10px;
        color: rgb(147, 153, 159);
      }
    }

    .overview-right {
      flex: 1;
      padding: 6px 0 6px 12px;

      @media only screen and (max-width: 320px) {
        padding-left: 6px;
      }

      .score-warpper {
        margin-bottom: 8px;
        font-size: 0;

        .title {
          display: inline-block;
          vertical-align: top;
          font-size: 12px;
          line-height: 18px;
          color: rgb(7, 17, 27);
        }

        .star {
          display: inline-block;
          vertical-align: top;
          margin: 0 12px;

          @media only screen and (max-width: 320px) {
            margin: 0 6px;
          }
        }

        .score {
          display: inline-block;
          vertical-align: top;
          font-size: 12px;
          line-height: 18px;
          color: rgb(255, 153, 0);
        }
      }

      .delivery-warpper {
        font-size: 0;

        .title {
          font-size: 12px;
          line-height: 18px;
          color: rgb(7, 17, 27);
        }

        .delivery {
          margin-left: 12px;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }

  .ratings-warpper {
    padding: 0 18px;

    .rating-item {
      padding: 18px 0;
      border-1px(rgba(7, 17, 27, 0.2));
      display: flex;

      .avatar {
        flex: 0 0 28px;
        width: 28px;

        img {
          border-radius: 50%;
        }
      }

      .content {
        position: relative;
        flex: 1;
        margin-left: 12px;

        .name {
          margin-bottom: 4px;
          font-size: 10px;
          line-height: 12px;
          color: rgb(7, 17, 27);
        }

        .star-warpper {
          margin-bottom: 6px;

          .star {
            display: inline-block;
            margin-right: 6px;
            line-height: 12px;
          }

          .delivery {
            display: inline-block;
            font-size: 10px;
            line-height: 12px;
            font-weight: 200px;
            color: rgb(147, 153, 159);
          }
        }

        .text {
          margin-bottom: 8px;
          font-size: 12px;
          line-height: 18px;
          color: rgb(7, 17, 27);
        }

        .recommend {
          .icon-thumb-up {
            font-size: 12px;
            line-height: 16px;
            color: rgb(0, 160, 220);
          }

          .recommend-item {
            display: inline-block;
            padding: 3px 6px;
            margin: 0 8px 4px 0;
            border: 1px solid rgba(7, 17, 27, 0.1);
            border-radius: 1px;
            font-size: 9px;
            color: rgb(147, 153, 159);
          }
        }

        .time {
          position: absolute;
          top: 0;
          right: 0px;
          font-size: 10px;
          color: rgb(147, 153, 159);
          margin-bottom: 6px;
          line-height: 16px;
        }
      }
    }
  }
}
</style>

