<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Lunar, LunarMonth } from 'lunar-typescript'

const now = Lunar.fromDate(new Date())

class Day {
  public lunarDay: string = ''
  public text: string = ''
  public isFestival: boolean = false
  public isToday: boolean = false
  public isJie: boolean = false
  public isQi: boolean = false
}

const state = reactive({
  year: now.getYear(),
  month: now.getMonth(),
  yearInChinese: '',
  yearInGanZhi: '',
  yearShengXiao: '',
  monthInChinese: '',
  monthInGanZhi: '',
  weekStart: 0,
  heads: ['日', '一', '二', '三', '四', '五', '六'],
  days: new Array<Day>()
})

let monthInGanZhi: string = ''

function buildDay(d: Lunar) {
  const day = new Day()
  let lunarDay = d.getDayInChinese()
  if (1 === d.getDay()) {
    lunarDay = d.getMonthInChinese() + '月'
  }
  const gz = d.getMonthInGanZhi()
  if (monthInGanZhi !== '' && monthInGanZhi !== gz) {
    lunarDay = gz
  }
  monthInGanZhi = gz
  day.lunarDay = lunarDay
  const solar = d.getSolar()
  let text = solar.getDay() + ''
  if (1 == solar.getDay()) {
    text = solar.getMonth() + '月'
  }
  const otherFestivals = d.getOtherFestivals()
  if (otherFestivals.length > 0) {
    text = otherFestivals[0]
    day.isFestival = true
  }
  const festivals = d.getFestivals()
  if (festivals.length > 0) {
    text = festivals[0]
    day.isFestival = true
  }
  const jq = d.getCurrentJieQi()
  if (jq) {
    text = jq.getName()
    day.isFestival = true
    day.isJie = jq.isJie()
    day.isQi = jq.isQi()
  }
  day.text = text
  if (d.toString() === now.toString()) {
    day.isToday = true
  }
  return day
}

function render() {
  const month = LunarMonth.fromYm(state.year, state.month)!
  const size = month.getDayCount()
  const days: any = []
  const lunar = Lunar.fromYmd(state.year, state.month, 1)
  const blankDay = new Day()
  for (let i = 0; i < lunar.getWeek(); i++) {
    days.push(blankDay)
  }
  days.push(buildDay(lunar))
  let lastWeek = 0
  for (let i = 1; i < size; i++) {
    const d = lunar.next(i)
    lastWeek = d.getWeek()
    days.push(buildDay(d))
  }
  for (let i = 0; i < 6 - lastWeek; i++) {
    days.push(blankDay)
  }
  state.days = days
  state.yearInChinese = lunar.getYearInChinese()
  state.yearInGanZhi = lunar.getYearInGanZhi()
  state.yearShengXiao = lunar.getYearShengXiao()
  state.monthInChinese = lunar.getMonthInChinese()
  state.monthInGanZhi = month.getGanZhi()
}

render()

watch(
  () => state.year,
  () => {
    render()
  }
)

watch(
  () => state.month,
  () => {
    render()
  }
)

function onPrevMonth() {
  monthInGanZhi = ''
  const month = LunarMonth.fromYm(state.year, state.month)!.next(-1)!
  state.year = month.getYear()
  state.month = month.getMonth()
}

function onNextMonth() {
  monthInGanZhi = ''
  const month = LunarMonth.fromYm(state.year, state.month)!.next(1)!
  state.year = month.getYear()
  state.month = month.getMonth()
}
</script>

<template>
  <div class="calendar">
    <div class="title">
      <div>{{ state.yearInChinese }} {{ state.yearInGanZhi }}({{ state.yearShengXiao }})年</div>
      <div class="month">
        <a href="javascript:void(0);" @click="onPrevMonth">&lt;</a>
        {{ state.monthInChinese }}月({{ state.monthInGanZhi }})
        <a href="javascript:void(0);" @click="onNextMonth">&gt;</a>
      </div>
    </div>
    <div class="body">
      <ul class="week">
        <li v-for="head in state.heads" :key="head">星期{{ head }}</li>
      </ul>
      <ul class="day">
        <li v-for="day in state.days" :key="day.text" :class="{ festival: day.isFestival }">
          {{ day.lunarDay }}
          <i>{{ day.text }}</i>
          <b v-if="day.isToday">今</b>
          <u v-if="day.isJie || day.isQi" :class="{ qi: day.isQi }">{{
            day.isJie ? '节' : '气'
          }}</u>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.calendar {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  color: #303133;

  a {
    color: #409eff;
    text-decoration: none;
  }

  div.title {
    height: 48px;
    line-height: 48px;
    font-size: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #606266;

    div.month {
      width: 140px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  div.body {
    border-left: 1px solid #cdd0d6;
    border-top: 1px solid #cdd0d6;
    overflow: hidden;

    ul {
      list-style: none;
      width: 630px;

      li {
        float: left;
        width: 90px;
        border-right: 1px solid #cdd0d6;
        border-bottom: 1px solid #cdd0d6;
      }
    }

    ul.week {
      li {
        height: 36px;
        line-height: 36px;
        background: #f5f7fa;
        font-size: 12px;
      }
    }

    ul.day {
      li {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 70px;
        font-size: 16px;

        i {
          font-style: normal;
          display: block;
          font-size: 15px;
          color: #909399;
        }

        b {
          position: absolute;
          left: 5px;
          top: 15px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          font-weight: normal;
          color: #ffffff;
          font-size: 10px;
          background: #e6a23c;
        }

        u {
          position: absolute;
          right: 10px;
          top: 10px;
          width: 16px;
          height: 16px;
          line-height: 16px;
          font-weight: normal;
          color: #ffffff;
          font-size: 9px;
          background: #ff0025;
          text-decoration: none;
          border-radius: 10px;
        }
        u.qi {
          background: #003cff;
        }
      }

      li.festival {
        i {
          color: #409eff;
        }
      }
    }
  }
}
</style>
