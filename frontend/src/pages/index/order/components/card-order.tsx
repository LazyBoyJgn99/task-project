import Taro from '@tarojs/taro';
import {
  Avatar,
  Button,
  Cell,
  CountDown,
  Dialog,
} from '@nutui/nutui-react-taro';
import { View, Text } from '@tarojs/components';
import { IconFont } from '@nutui/icons-react-taro';
import { useEffect, useState } from 'react';
import { generateUUID } from '@/utils/uuid';
import { priceToString } from '@/utils/price';
import {
  DetailPageType,
  EnumOrderStatus,
  getPaidStopTime,
  IOrder,
  IOrderDisplay,
  IOrderTotal,
  orderTotalStatusFormat,
} from '@/types/order';
import './card-order.less';
import { cancel } from '@/utils/wxpay';
import { EnumCrowd, EnumTicketType } from '@/types/ticket';
import { formatDate, formatDateTime } from '@/utils/time';

interface IProps {
  orderTotal: IOrderTotal;
  refreshList: () => void;
}

const sortDisplayOrder = (orders: IOrderDisplay[]) => {
  return orders.sort((a, b) => {
    if (a.attribute.crowd === EnumCrowd.ADULT) {
      return -1;
    } else if (b.attribute.crowd === EnumCrowd.ADULT) {
      return 1;
    } else {
      return -9;
    }
  });
};

/**
 * 重新构造展示用的订单列表
 * @param orderList 子订单列表
 */
const getDisplayOrderList = (orderList: IOrder[]) => {
  const displayOrderList: IOrderDisplay[] = [];
  orderList.forEach((order) => {
    // 判断数组中是否存在相同商品
    const hadSimilar = displayOrderList.find(
      (item) => item.name === order.commodity.name
    );
    // 如果存在，则给数组中的商品数据+1，价格累加
    if (hadSimilar) {
      hadSimilar.number++;
      hadSimilar.price += order.price;
    } else {
      displayOrderList.push({
        id: generateUUID(),
        name: order.commodity.name,
        number: 1,
        price: order.price,
        coupon: order.coupon,
        attribute: order.commodity.attribute,
      });
    }
  });
  return sortDisplayOrder(displayOrderList);
};

const goDetailPage = (orderTotalId: string, type: string = 'detail') => {
  Taro.navigateTo({
    url: `/pages/order-detail/index?id=${orderTotalId}&type=${type}`,
  });
};

const orderNameFormat = (order: IOrderDisplay) => {
  return order.attribute.type === EnumTicketType.GRASS
    ? '草料'
    : order.attribute.crowd + EnumTicketType.TICKET;
};

const goPayPage = (orderTotal: IOrderTotal) => {
  const stopTime = getPaidStopTime(orderTotal.createTime);
  const now = new Date().getTime();
  if (stopTime <= now) {
    goDetailPage(orderTotal.id, DetailPageType.DETAIL);
  } else {
    goDetailPage(orderTotal.id, DetailPageType.PAY);
  }
};

const buttonsRenderUnPaid = (
  orderTotal: IOrderTotal,
  confirmCancel: (orderTotalId: string) => void
) => {
  const stopTime = getPaidStopTime(orderTotal.createTime);
  const now = new Date().getTime();
  return (
    <View className="buttons-unpaid">
      {now < stopTime ? (
        <View className="stop-time">
          剩余
          <CountDown remainingTime={stopTime - now} />
        </View>
      ) : (
        <View className="out-time"></View>
      )}
      <View style={{ height: 24 }}>
        {now < stopTime && (
          <>
            <Button
              type="default"
              size="mini"
              onClick={() => confirmCancel(orderTotal.id)}>
              取消
            </Button>
            <Button
              type="primary"
              size="mini"
              onClick={() => goPayPage(orderTotal)}>
              付款
            </Button>
          </>
        )}
        {now >= stopTime && (
          <Button
            type="default"
            size="mini"
            onClick={() => goDetailPage(orderTotal.id)}>
            详情
          </Button>
        )}
      </View>
    </View>
  );
};

const goTicketPage = () => {
  Taro.navigateTo({ url: '/pages/ticket-use/index' });
};

const buttonsRenderPaid = () => {
  return (
    <>
      <Button type="primary" size="mini" onClick={goTicketPage}>
        使用
      </Button>
    </>
  );
};

const buttonRenderDetail = (orderTotal: IOrderTotal) => {
  return (
    <Button
      type="default"
      size="mini"
      onClick={() => goDetailPage(orderTotal.id)}>
      详情
    </Button>
  );
};

const buttonsRender = (
  orderTotal: IOrderTotal,
  confirmCancel: (orderTotalId: string) => void
) => {
  const statusList = orderTotal.children.map((order) => order.status);
  if (statusList.includes(EnumOrderStatus.UNPAID)) {
    return buttonsRenderUnPaid(orderTotal, confirmCancel);
  } else if (statusList.includes(EnumOrderStatus.PAID)) {
    return buttonsRenderPaid();
  } else if (
    statusList.includes(EnumOrderStatus.REFUNDING) ||
    statusList.includes(EnumOrderStatus.EXCEPTION) ||
    statusList.includes(EnumOrderStatus.CANCELED) ||
    statusList.includes(EnumOrderStatus.REFUNDED) ||
    statusList.includes(EnumOrderStatus.USED)
  ) {
    return buttonRenderDetail(orderTotal);
  }
};

const isGoPayPage = (orderTotal: IOrderTotal) => {
  const statusList = orderTotal.children.map((order) => order.status);
  if (statusList.includes(EnumOrderStatus.UNPAID)) {
    return true;
  }
};

export default function Index(props: IProps) {
  const { orderTotal, refreshList } = props;
  const [displayOrderList, setDisplayOrderList] = useState<IOrderDisplay[]>([]);

  useEffect(() => {
    const displayOrders = getDisplayOrderList(orderTotal.children);
    setDisplayOrderList(displayOrders);
  }, [orderTotal]);

  /**
   * 取消订单
   */
  const initCancel = async (orderId: string) => {
    await cancel(
      orderId,
      () => {
        Taro.showToast({
          title: `订单取消成功`,
          icon: 'none',
        });
        refreshList();
      },
      () => {
        Taro.showToast({
          title: `订单取消失败`,
          icon: 'none',
        });
      }
    );
  };

  const confirmCancel = (orderTotalId: string) => {
    Dialog.open('cancel', {
      title: '取消提醒',
      content: '取消操作无法回退，确定取消吗？',
      onConfirm: () => {
        initCancel(orderTotalId);
        Dialog.close('cancel');
      },
      onCancel: () => {
        Dialog.close('cancel');
      },
    });
  };

  return (
    <View className="order-card-order">
      <Cell.Group>
        <Cell
          className="cell-row-1"
          title={
            <View className="order-title">
              <View>订单时间：{formatDateTime(orderTotal.createTime)}</View>
              <View className="status">
                {orderTotalStatusFormat(orderTotal._status)}
              </View>
            </View>
          }
        />
        <Cell
          onClick={() =>
            isGoPayPage(orderTotal)
              ? goPayPage(orderTotal)
              : goDetailPage(orderTotal.id)
          }>
          <View className="order-box">
            <View className="icon-box">
              <Avatar
                size="48"
                icon={
                  <IconFont
                    size={22}
                    fontClassName="icon"
                    color="#000"
                    classPrefix="go-farm"
                    name="avatar"
                  />
                }
                shape="round"
              />
            </View>
            <View className="order-item-wrapper">
              <View className="wrapper-title">
                <View>GO FARM趣农场</View>
                <View>{priceToString(orderTotal.price)}</View>
              </View>
              <View className="wrapper-date">
                {formatDate(orderTotal.children[0].commodity.date)}
              </View>
              {displayOrderList.map((order) => {
                return (
                  <Text className="order-item">
                    {order.number} {orderNameFormat(order)}&nbsp;&nbsp;
                  </Text>
                );
              })}
            </View>
          </View>
        </Cell>
        <Cell className="cell-foot">
          <View className="order-buttons">
            {buttonsRender(orderTotal, confirmCancel)}
          </View>
        </Cell>
      </Cell.Group>
    </View>
  );
}
