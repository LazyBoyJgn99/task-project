import Taro from '@tarojs/taro';
import request from '@/utils/request';
import drawQrcode from '@/utils/weapp.qrcode.esm.js';
import LoadingPage from '@/components/loading-page';
import { View, Image } from '@tarojs/components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from '@nutui/icons-react-taro';
import { Empty, NavBar, Swiper } from '@nutui/nutui-react-taro';
import { useSelector } from 'react-redux';
import { EnumOrderStatus, IOrderTotal } from '@/types/order';
import {
  EnumCrowd,
  EnumTicketStatus,
  EnumTicketType,
  ITicket,
} from '@/types/ticket';
import { getCurrentDate, isToday } from '@/utils/time';
// import { io } from 'weapp.socket.io';
import { domain } from '@/utils/request';
import { getUser } from '@/utils/user';
import './index.less';

const drawQrCode = (canvasId: string, text: string, proportion: number) => {
  drawQrcode({
    width: 150 * proportion,
    height: 150 * proportion,
    canvasId,
    text,
  });
};

const handleOrderToTickets = (orderTotalList: IOrderTotal[]) => {
  const today = getCurrentDate();
  // 获取可使用的门票
  const allOrders = orderTotalList.flatMap((orderTotal) => {
    return orderTotal.children
      .filter((order) => order.status === EnumOrderStatus.PAID)
      .map((order) => ({
        ...order,
        _totalOrderId: orderTotal.id,
      }));
  });

  const tickets: ITicket[] = allOrders
    .filter((order) => order.commodity.attribute.type === EnumTicketType.TICKET)
    .map((order) => {
      return {
        attribute: order.commodity.attribute,
        date: order.commodity.date as string,
        id: order.commodity.id,
        name: order.commodity.name,
        stock: order.commodity.stock,
        price: order.commodity.price,
        status: order.commodity.status,
        _userId: order.user.id,
        _orderId: order.id,
        _status:
          getCurrentDate(order.commodity.date) < today
            ? EnumTicketStatus.EXPIRED
            : EnumTicketStatus.CANUSED,
      };
    });

  const grasses: ITicket[] = [];
  allOrders
    .filter((order) => order.commodity.attribute.type === EnumTicketType.GRASS)
    .forEach((grassOrder) => {
      const pushedGrass = grasses.find(
        (grass: any) => grass.date === grassOrder.commodity.date
      );
      if (pushedGrass) {
        pushedGrass._orderCount && pushedGrass._orderCount++;
      } else {
        grasses.push({
          attribute: grassOrder.commodity.attribute,
          date: grassOrder.commodity.date as string,
          id: grassOrder.commodity.id,
          name: grassOrder.commodity.name,
          stock: grassOrder.commodity.stock,
          price: grassOrder.commodity.price,
          status: grassOrder.commodity.status,
          _orderCount: 1,
          _orderId: grassOrder._totalOrderId,
          _userId: grassOrder.user.id,
          _status:
            getCurrentDate(grassOrder.commodity.date) < today
              ? EnumTicketStatus.EXPIRED
              : EnumTicketStatus.CANUSED,
        });
      }
    });
  return [...tickets, ...grasses]
    .sort((a) => {
      if (a.attribute?.crowd === EnumCrowd.ADULT) return -1;
      if (a.attribute?.crowd === EnumCrowd.CHILD) return 0;
      if (a.attribute?.type === EnumTicketType.GRASS) return 1;
      return 0;
    })
    .sort(
      (a, b) =>
        new Date(a.date as string).getTime() -
        new Date(b.date as string).getTime()
    );
};

// proportion用于适配不同分辨率的机型
const makeQrCodeByTickets = (tickets: ITicket[], proportion: number) => {
  tickets.forEach((ticket) => {
    if (ticket.attribute.type === EnumTicketType.GRASS) {
      drawQrCode(
        ticket._orderId,
        `grass-${ticket._userId}-${ticket._orderCount}`,
        proportion
      );
    } else {
      drawQrCode(ticket._orderId, `ticket-${ticket._orderId}`, proportion);
    }
  });
};

export default function Index() {
  const barHeight = useSelector((state: any) => state.system.barHeight);
  const firstRender = useRef(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [swiperValue, setSwiperValue] = useState<number>(0);

  const systemInfo = Taro.getSystemInfoSync();
  const proportion = systemInfo.screenWidth / 375;

  useEffect(() => {
    const user = getUser();
    if (!user?.id) {
      Taro.redirectTo({ url: '/pages/login/index' });
      return;
    }
    requestForOrders(user.id);
  }, []);

  const requestForOrders = useCallback(async (userId: string) => {
    const orderTotals = await request
      .get<IOrderTotal[]>('/order', {
        userId: userId,
      })
      .catch(() => {
        return [];
      });
    const tickets = handleOrderToTickets(orderTotals);
    setTickets(tickets);
  }, []);

  const onSwiperChange = (event: any) => {
    setSwiperValue(event.detail.current);
  };

  useEffect(() => {
    if (!firstRender.current) {
      makeQrCodeByTickets(tickets, proportion);
      setLoading(false);
    }
    firstRender.current = false;
  }, [tickets]);

  useEffect(() => {
    // const socket = io(`${domain}/pos`);
    // Taro.connectSocket({
    //   url: `${domain}/pos/socket.io`,
    //   success: function () {
    //     console.log('connect success');
    //   },
    // }).then((task) => {
    //   task.onOpen(function () {
    //     console.log('onOpen');
    //   });
    //   task.onMessage(function (msg) {
    //     console.log('onMessage: ', msg);
    //   });
    //   task.onError(function (err) {
    //     console.log(
    //       '%c [ err ]-127',
    //       'font-size:13px; background:#5c0a33; color:#a04e77;',
    //       err
    //     );
    //     console.log('onError');
    //   });
    //   task.onClose(function (e) {
    //     console.log('onClose: ', e);
    //   });
    // });
  }, []);

  return (
    <View className="ticket-use">
      <LoadingPage loading={loading} />
      <View style={{ height: `${barHeight + 60}px`, width: '100%' }}></View>
      <NavBar
        style={{ position: 'fixed', top: `${barHeight}px` }}
        back={<ArrowLeft size={18} />}
        onBackClick={() => Taro.navigateBack()}
      />
      <View className="background" />
      <View className="ticket-container">
        <Image
          className="ticket-background"
          src={`${domain}/images/ticket-box.png`}
        />
        <View className="ticket-info">
          {tickets[swiperValue]?.name}
          {tickets[swiperValue]?._orderCount &&
            ` x ${tickets[swiperValue]?._orderCount}`}
        </View>
        {!!tickets.length && (
          <View className="swiper-wapper">
            <Swiper defaultValue={0} indicator onChange={onSwiperChange}>
              {tickets.map((item) => (
                <Swiper.Item key={item.id}>
                  <View className="qrcode-box">
                    {isToday(new Date(item.date)) && (
                      <canvas
                        style={{
                          width: 150 * proportion,
                          height: 150 * proportion,
                          zIndex: 0,
                        }}
                        canvas-id={item._orderId}
                      />
                    )}
                    {!isToday(new Date(item.date)) && (
                      <>
                        <View className="qr-code-fake">
                          <Image
                            style={{
                              width: 150 * proportion,
                              height: 150 * proportion,
                            }}
                            src={`${domain}/images/qr-code-fake.png`}
                          />
                        </View>
                        <View className="not-in-time">
                          <View>不在使用日期</View>
                        </View>
                      </>
                    )}
                  </View>
                </Swiper.Item>
              ))}
            </Swiper>
          </View>
        )}
        {!tickets.length && (
          <View className="empty-box">
            <Empty
              image={<img src={`${domain}/images/empty.png`} alt="" />}
              size="small"
              description="未购买门票"
            />
          </View>
        )}
      </View>
      <View className="notice">
        <View className="title">
          <View className="icon" />
          注意事项
        </View>
        <View className="content primary">
          11:30-12:10动物休息时间 所有动物互动关闭，游客需离开所有互动区
        </View>
        <View className="content">
          1.
          如被动物抓伤、咬伤等问题，请在现场第一时间联系工作人员，离园概不负责。
        </View>
        <View className="content">2.谢绝外带宠物入园，园区内禁止吸烟。</View>
        <View className="content">
          3.禁止追赶动物/大声尖叫/攀爬围栏等行为。
        </View>
        <View className="content">
          4.动物近距离互动需联系现场工作人员，请勿私自操作，以免互相受伤。
        </View>
        <View className="content">
          5.园区动物有规定食物，谢绝自带食物投喂。
        </View>
      </View>
    </View>
  );
}
