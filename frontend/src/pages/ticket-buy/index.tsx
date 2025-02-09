import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { ArrowRight, Checklist } from '@nutui/icons-react-taro';
import {
  EnumCrowd,
  EnumTicketType,
  EnumTicketWorkStatus,
  ITicket,
} from '@/types/ticket';
import { priceToStringDeformation } from '@/utils/price';
import {
  formatDateToString,
  formatDateToString_2,
  getDatesBetween,
  getToday,
  isToday,
} from '@/utils/time';
import {
  Badge,
  Calendar,
  Cell,
  ConfigProvider,
  InputNumber,
  Button,
  Dialog,
} from '@nutui/nutui-react-taro';
import Taro, { useDidShow } from '@tarojs/taro';
import request from '@/utils/request';
import './index.less';

const SALE_STOP_TIME = 16;

/**
 * 门票排序
 */
const sortTickets = (tickets: ITicket[]) => {
  // 成人票在前面
  tickets.sort((a, b) => {
    if (a.attribute.crowd === EnumCrowd.ADULT) {
      return -1;
    } else if (b.attribute.crowd === EnumCrowd.ADULT) {
      return 1;
    } else {
      return -9;
    }
  });

  // 日期从早到晚
  tickets.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

/**
 * 校验是否选择了票
 */
const checkSelected = (ticketBuyNum: number[], grassBuyNum: number[]) => {
  const ticketNum = ticketBuyNum.reduce((pre, cur) => {
    return pre + cur;
  }, 0);
  const grassNum = grassBuyNum.reduce((pre, cur) => {
    return pre + cur;
  }, 0);
  return ticketNum + grassNum === 0;
};

const computedDisableDate = (
  tickets: ITicket[],
  isTodayTicketCanBug: boolean
) => {
  const dateObj: Record<string, boolean> = {};
  const dates = getDatesBetween(
    tickets[0].date,
    tickets[tickets.length - 1].date
  );
  dates.forEach((date) => {
    const hasDayTicket = tickets.find((item) => item.date === date);
    const isWorkDay = hasDayTicket?.status === EnumTicketWorkStatus.ONSALE;
    const isTodayCantBug = isToday(new Date(date)) && !isTodayTicketCanBug;
    // 当天没有门票或者门票不为可售状态
    dateObj[date] = !hasDayTicket || !isWorkDay || isTodayCantBug;
  });
  return dateObj;
};

const customTheme = {
  nutuiInputnumberButtonWidth: '24px',
  nutuiInputnumberButtonHeight: '24px',
  nutuiInputnumberButtonBorderRadius: '2px',
  nutuiInputnumberButtonBackgroundColor: `#f4f4f4`,
  nutuiInputnumberInputBackgroundColor: '#fff',
  nutuiInputnumberInputMargin: '0 2px',
};

export default function Index() {
  // 所有门票
  const [tickets, setTickets] = useState<ITicket[]>([]);
  // 日历可选范围开始时间
  const [startDate, setStartDate] = useState<string>();
  // 日历可选范围结束时间
  const [endDate, setEndDate] = useState<string>();
  // 禁用日期
  const [disableDate, setDisableDate] = useState<Record<string, boolean>>({});
  // 日历开关
  const [calendarVisible, setCalendarVisible] = useState(false);
  // 今天的格式化日期
  const today = formatDateToString(new Date());
  // 明天的格式化日期
  const tomarrow = formatDateToString(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  // 当前选择的日期
  const [selectDate, setSelectDate] = useState(today);
  // 购买票的数量
  const [ticketBuyNum, setTicketBuyNum] = useState<number[]>([0, 0, 0, 0]);
  // 购买草的数量
  const [grassBuyNum, setGrassBuyNum] = useState<number[]>([0, 0]);
  // 当天是否还能购买
  const isTodayTicketCanBug = new Date().getHours() < SALE_STOP_TIME;

  /**
   * 获取从今天起的所有门票
   */
  const requestForTickets = async () => {
    const tickets = await request.get<ITicket[]>('/commodity/by-date', {
      date: today,
    });
    if (tickets.length) {
      sortTickets(tickets);
      setTickets(tickets);
      setStartDate(tickets[0].date);
      setEndDate(tickets[tickets.length - 1].date);
      // 根据门票计算禁用日期
      const disableDates = computedDisableDate(tickets, isTodayTicketCanBug);
      setDisableDate(disableDates);
    }
  };

  const disabledDateFunc = (date: any) => {
    if (!date.year) return false;
    const dateString = formatDateToString_2(date.year, date.month, date.day);
    return disableDate[dateString];
  };

  useEffect(() => {
    Taro.showLoading({ title: '加载中...' });
    requestForTickets().finally(() => {
      Taro.hideLoading();
    });
  }, []);

  useDidShow(() => {
    Taro.showLoading({ title: '加载中...' });
    requestForTickets().finally(() => {
      Taro.hideLoading();
    });
  });

  /**
   * 日历选择回调
   */
  const setChooseValue = (param: string) => {
    const newDate = param[3].replace(/\//g, '-');
    setSelectDate(newDate);
  };

  useEffect(() => {
    setTicketBuyNum([0, 0, 0, 0]);
    setGrassBuyNum([0, 0]);
  }, [selectDate]);

  /**
   * 计算指定日期下展示的文字
   */
  const specifyDate = () => {
    return [today, tomarrow].includes(selectDate) ? '请选择' : selectDate;
  };

  /**
   * 更新票购买数量
   */
  const updateTicketBuyNum = (index: number, num: number) => {
    const newBuyNum = [...ticketBuyNum];
    newBuyNum[index] = num;
    setTicketBuyNum(newBuyNum);
  };

  /**
   * 更新草购买数量
   */
  const updateGrassBuyNum = (index: number, num: number) => {
    const newBuyNum = [...grassBuyNum];
    newBuyNum[index] = num;
    setGrassBuyNum(newBuyNum);
  };

  const ticketFilter = (tickets: ITicket[]) => {
    return tickets.filter(
      (item) =>
        item.date === selectDate &&
        item.status === EnumTicketWorkStatus.ONSALE &&
        item.attribute.type === EnumTicketType.TICKET
    );
  };

  const grassFilter = (tickets: ITicket[]) => {
    return tickets.filter(
      (item) =>
        item.date === selectDate &&
        item.status === EnumTicketWorkStatus.ONSALE &&
        item.attribute.type === EnumTicketType.GRASS
    );
  };

  /**
   * 价格计算
   */
  const totalPrice = () => {
    const ticketTotalPrice = ticketFilter(tickets).reduce((pre, cur, index) => {
      return pre + cur.price * ticketBuyNum[index];
    }, 0);
    const grassTotalPrice = grassFilter(tickets).reduce((pre, cur, index) => {
      return pre + cur.price * grassBuyNum[index];
    }, 0);
    return ticketTotalPrice + grassTotalPrice;
  };

  /**
   * 如果只包含儿童票，需要提醒游客需要大人陪同
   */
  const checkIsRead = (
    ticketDetail: {
      id: string;
      number: number;
      attribute: any;
    }[]
  ) => {
    // 判断是否包含成人票
    const adultTickets = ticketDetail.filter((item) => {
      if (item.attribute.crowd === EnumCrowd.ADULT && item.number > 0) {
        return true;
      }
    });
    // 判断是否包含儿童票
    const childTickets = ticketDetail.filter((item) => {
      if (item.attribute.crowd === EnumCrowd.CHILD && item.number > 0) {
        return true;
      }
    });
    if (adultTickets.length > 0) return true;
    if (childTickets.length === 0) return true;
    // 判断是否已经阅读
    Dialog.open('read', {
      title: '购买提醒',
      content: (
        <View>
          为了确保每一位小朋友的安全，
          <Text style={{ color: '#006241', fontWeight: 600 }}>
            儿童需在成人陪同下入园参观
          </Text>
          。感谢您的理解与配合！
        </View>
      ),
      onConfirm: () => {
        goOrderReview(true);
        Dialog.close('read');
      },
      onCancel: () => {
        Dialog.close('read');
      },
    });
  };

  /**
   * 前往订单确认页
   */
  const goOrderReview = (isRead = false) => {
    const ticketList = ticketFilter(tickets);
    const grassList = grassFilter(tickets);
    // 用户选择门票数量
    const ticketNum = ticketBuyNum.reduce((pre, cur) => {
      return pre + cur;
    }, 0);
    // 因为成人票和儿童票用的是同一个库存，所以这里直接取排序后的第一个就能拿到库存
    if (ticketNum > 0 && ticketList[0].stock === 0) {
      Taro.showToast({
        title: `门票已售罄`,
        icon: 'none',
      });
      return;
    }
    if (ticketNum > ticketList[0].stock) {
      Taro.showToast({
        title: `仅剩${ticketList[0].stock}张门票`,
        icon: 'none',
      });
      return;
    }
    // 获取用户购票的详细信息
    const ticketDetail = ticketList.map((item, index) => {
      return {
        id: item.id,
        number: ticketBuyNum[index],
        attribute: item.attribute,
      };
    });
    // 判断是否已经阅读用户需知
    if (!isRead && !checkIsRead(ticketDetail)) return;
    const grassDetail = grassList.map((item, index) => {
      return {
        id: item.id,
        number: grassBuyNum[index],
      };
    });
    // 携带购买信息前往订单确认页
    Taro.navigateTo({
      url: `/pages/order-review/index?detail=${JSON.stringify([
        ...ticketDetail,
        ...grassDetail,
      ])}`,
    });
  };

  const descriptionFormat = (ticket: ITicket) => {
    if (ticket.attribute.crowd === EnumCrowd.CHILD) {
      return '入园当日身高130cm以下的游客';
    } else {
      return '标准成人票';
    }
  };

  const renderDayBottom = (date: any) => {
    if (date.type !== 'active') return '';
    const month = date.month.toString().padStart(2, '0');
    const day = date.day.toString().padStart(2, '0');
    const dateString = date.year + '-' + month + '-' + day;
    const adultTicket = tickets.find(
      (item) =>
        item.attribute.type === EnumTicketType.TICKET &&
        item.attribute.crowd === EnumCrowd.ADULT &&
        item.date === dateString
    );
    // 如果时间在今天之前，展示停售
    const dateString2 = dateString.replace(/-/g, '/');
    const dateTime = new Date(dateString2 + ' 00:00:00').getTime();
    if (dateTime < getToday().getTime()) {
      return <span className="calendar-null">停售</span>;
    }
    // 如果是当天，购买时间超SALE_STOP_TIME，展示停售
    const now = new Date();
    if (isToday(new Date(dateString2)) && now.getHours() >= SALE_STOP_TIME) {
      return <span className="calendar-null">停售</span>;
    }
    // 如果是今天之后的时间，有票且状态为休息，则展示休息
    if (adultTicket && adultTicket.status === EnumTicketWorkStatus.REST) {
      return <span className="calendar-null">休息</span>;
    }
    // 如果是今天之后的时间，有票且状态为营业中，则显示价格
    if (adultTicket && adultTicket.status === EnumTicketWorkStatus.ONSALE) {
      return <span className="calendar-price">¥{adultTicket?.price}</span>;
    }
    return <span className="calendar-null">未放票</span>;
  };

  return (
    <View className="ticket-buy">
      <Dialog id="read" />
      <View className="title">入园日期</View>
      <View className="select-date-box">
        <Badge value={selectDate === today ? <Checklist color="#fff" /> : null}>
          <Cell
            title="今天"
            description={today}
            className={selectDate === today ? 'selected' : ''}
            onClick={() => setSelectDate(today)}
          />
        </Badge>
        <Badge
          value={selectDate === tomarrow ? <Checklist color="#fff" /> : null}>
          <Cell
            title="明天"
            description={tomarrow}
            className={selectDate === tomarrow ? 'selected' : ''}
            onClick={() => setSelectDate(tomarrow)}
          />
        </Badge>
        <Badge
          value={
            selectDate !== tomarrow && selectDate !== today ? (
              <Checklist color="#fff" />
            ) : null
          }>
          <Cell
            title={
              <View className="specify-date-title">
                <Text>指定日期</Text>
                <ArrowRight className="icon" size={14} />
              </View>
            }
            className={
              selectDate !== tomarrow && selectDate !== today ? 'selected' : ''
            }
            description={specifyDate()}
            onClick={() => setCalendarVisible(true)}
          />
        </Badge>
      </View>

      {(!isToday(new Date(selectDate)) || isTodayTicketCanBug) && (
        <>
          {ticketFilter(tickets).length > 0 && (
            <View className="title">选择票种（不支持退款）</View>
          )}
          {ticketFilter(tickets).map((item, index) => (
            <Cell
              align="center"
              title={item.name.split(' ')[0]}
              description={descriptionFormat(item)}
              className="ticket-buy-cell"
              extra={
                <View>
                  <View className="price-ticket">¥ {item.price}</View>
                  <ConfigProvider className="input" theme={customTheme}>
                    <InputNumber
                      min={0}
                      value={ticketBuyNum[index]}
                      onChange={(value) =>
                        updateTicketBuyNum(index, value as number)
                      }
                    />
                  </ConfigProvider>
                </View>
              }
            />
          ))}
          {grassFilter(tickets).length > 0 && (
            <View className="title">其他</View>
          )}
          {grassFilter(tickets).map((item, index) => (
            <Cell
              align="center"
              title={item.name.split(' ')[0]}
              description="一份草料【草料须成人保管】"
              className="ticket-buy-cell"
              extra={
                <View>
                  <View className="price-ticket">¥ {item.price}</View>
                  <ConfigProvider className="input" theme={customTheme}>
                    <InputNumber
                      min={0}
                      value={grassBuyNum[index]}
                      onChange={(value) =>
                        updateGrassBuyNum(index, value as number)
                      }
                    />
                  </ConfigProvider>
                </View>
              }
            />
          ))}
        </>
      )}

      <View className="empty"></View>

      <View className="bottom-box">
        <View className="total-price">
          <View>
            总计：
            <Text className="total-price-number">
              {priceToStringDeformation(totalPrice())}
            </Text>
          </View>
          <Button
            type="primary"
            disabled={checkSelected(ticketBuyNum, grassBuyNum)}
            onClick={() => goOrderReview()}>
            立即购买
          </Button>
        </View>
        <View className="empty"></View>
      </View>

      <Calendar
        visible={calendarVisible}
        showTitle={false}
        defaultValue={selectDate}
        startDate={startDate}
        endDate={endDate}
        disableDate={disabledDateFunc}
        renderDayBottom={renderDayBottom}
        onClose={() => setCalendarVisible(false)}
        onConfirm={setChooseValue}
      />
    </View>
  );
}
