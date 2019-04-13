<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block all" @click="ratingSelect(2,$event)" :class="{'active':type === 2}">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span class="block positive" @click="ratingSelect(0,$event)" :class="{'active':type === 0}">
        {{desc.positive}}
        <span class="count">{{positives.length}}</span>
      </span>
      <span class="block negative" @click="ratingSelect(1,$event)" :class="{'active':type === 1}">
        {{desc.negative}}
        <span class="count">{{negatives.length}}</span>
      </span>
    </div>
    <div class="switch" @click="toggleContent" :class="{'on':only}">
      <span class="iconfont icon-baseline-check_circle-px"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  data() {
    return {
      only: this.onlyContent,
      type: this.selectType
    };
  },
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: "全部",
          positive: "满意",
          negative: "不满意"
        };
      }
    }
  },
  computed: {
    positives() {
      return this.ratings.filter(rating => {
        return rating.rateType === POSITIVE;
      });
    },
    negatives() {
      return this.ratings.filter(rating => {
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    ratingSelect(_type, event) {
      this.type = _type;
      this.$emit("rating-select", _type);
    },
    toggleContent(event) {
      this.only = !this.only;
      this.$emit("toggle-content", this.only);
    }
  },
  components: {}
};
</script>

<style scoped lang="stylus">
@import '../../common/stylus/mixin.styl';

.ratingselect {
  .rating-type {
    padding: 18px 0;
    margin: 0 18px;
    border-1px(rgba(7, 17, 27, 0.1));

    .block {
      padding: 6px 12px;
      margin-right: 6px;
      line-height: 16px;
      border-radius: 1px;
      color: rgb(77, 85, 93);
      font-size: 12px;

      &.active {
        color: #fff;
      }

      .count {
        font-size: 8px;
        margin-right: 2px;
      }

      &.all, &.positive {
        background: rgba(0, 160, 220, 0.2);

        &.active {
          background: rgb(0, 160, 220);
        }
      }

      &.negative {
        background: rgba(77, 85, 93, 0.2);

        &.active {
          background: rgb(77, 85, 93);
        }
      }
    }
  }

  .switch {
    padding: 12px 18px;
    line-height: 24px;
    color: rgb(147, 153, 159);
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    font-size: 0;

    &.on {
      .icon-baseline-check_circle-px {
        color: #00c850;
      }
    }

    .icon-baseline-check_circle-px {
      display: inline-block;
      vertical-align: top;
      font-size: 24px;
      margin-right: 8px;
    }

    .text {
      display: inline-block;
      vertical-align: top;
      font-size: 12px;
    }
  }
}
</style>
