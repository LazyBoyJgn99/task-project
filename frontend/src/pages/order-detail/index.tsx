import Taro from '@tarojs/taro';
import request from '@/utils/request';
import LoadingPage from '@/components/loading-page';
import ButtonOnce from '@/components/button-once';
import { generateUUID } from '@/utils/uuid';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Check,
  Close,
  IconFont,
  Loading2,
  LogisticsError,
} from '@nutui/icons-react-taro';
import { useEffect, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { formatDate, formatDateTime } from '@/utils/time';
import { priceToString } from '@/utils/price';
import { payment, refund } from '@/utils/wxpay';
import { domain } from '@/utils/request';
import {
  Avatar,
  Cell,
  ConfigProvider,
  Dialog,
  InputNumber,
  NavBar,
  Popup,
} from '@nutui/nutui-react-taro';
import {
  computeOrderStatus,
  computeOrderTotalStatus,
  DetailPageType,
  EnumOrderTotalStatus,
  IOrder,
  IOrderDisplay,
  IOrderTotal,
  IRefundDisplay,
  orderStatusFormat,
  orderTotalStatusFormat,
} from '@/types/order';
import './index.less';

const customInputTheme = {
  nutuiInputnumberButtonWidth: '24px',
  nutuiInputnumberButtonHeight: '24px',
  nutuiInputnumberButtonBackgroundColor: `#f4f4f4`,
  nutuiInputnumberInputBackgroundColor: '#fff',
  nutuiInputnumberInputMargin: '0 2px',
};

/**
 * 重新构造展示用的订单列表
 * @param orderList 子订单列表
 */
const getDisplayOrderList = (orderList: IOrder[]) => {
  const displayOrderList: IOrderDisplay[] = [];
  orderList.forEach((order) => {
    // 判断数组中是否存在相同商品
    const theSimilar = displayOrderList.find(
      (item) =>
        item.name === order.commodity.name && !item.coupon && !order.coupon
    );
    // 如果存在且没有使用优惠卷，则给数组中的商品数据+1
    if (theSimilar) {
      theSimilar.number++;
      theSimilar.children?.push(order);
    } else {
      displayOrderList.push({
        id: generateUUID(),
        name: order.commodity.name,
        number: 1,
        price: order.price,
        coupon: order.coupon,
        attribute: order.commodity.attribute,
        children: [order],
      });
    }
  });
  return displayOrderList;
};

const goTicketPage = () => {
  Taro.navigateTo({ url: '/pages/ticket-use/index' });
};

const getRefundOrderIds = (refundDisplayList: IRefundDisplay[]) => {
  return (
    refundDisplayList?.flatMap((item) => {
      let num = item.refundNumber;
      let ids: string[] = [];
      item.children?.forEach((order) => {
        if (num > 0) {
          num--;
          ids.push(order.id);
        }
      });
      return ids;
    }) || []
  );
};

export function orderTotalIconFormat(status: EnumOrderTotalStatus) {
  switch (status) {
    case EnumOrderTotalStatus.UNPAID:
      return <Loading2 size={14} color="#fff" />;
    case EnumOrderTotalStatus.TIME_OUT:
      return (
        <IconFont
          size={12}
          fontClassName="icon"
          color="#fff"
          classPrefix="go-farm"
          name="cancel"
        />
      );
    case EnumOrderTotalStatus.CANCELED:
      return <Close size={14} color="#fff" />;
    case EnumOrderTotalStatus.UNUSED:
      return <Check size={14} color="#fff" />;
    case EnumOrderTotalStatus.REFUNDING:
      return <Loading2 size={14} color="#fff" />;
    case EnumOrderTotalStatus.REFUNDED:
      return <Check size={14} color="#fff" />;
    case EnumOrderTotalStatus.USED:
      return <Check size={14} color="#fff" />;
    case EnumOrderTotalStatus.EXCEPTION:
      return <LogisticsError size={14} color="#fff" />;
    default:
      return <Check size={14} color="#fff" />;
  }
}

export default function Index() {
  const [loading, setLoading] = useState<boolean>(true);
  const [orderTotal, setOrderTotal] = useState<IOrderTotal>();
  const [pageType, setPageType] = useState<DetailPageType>();
  const [orderTotalId, setOrderTotalId] = useState<string>();
  const [displayOrderList, setDisplayOrderList] = useState<IOrderDisplay[]>([]);

  const barHeight = useSelector((state: any) => state.system.barHeight);

  /**
   * 支付回调提示
   */
  const onPayCallback = (isSuccess = true) => {
    if (isSuccess) {
      Taro.showToast({
        title: `支付成功`,
        icon: 'none',
      });
    } else {
      Taro.showToast({
        title: `支付失败`,
        icon: 'none',
      });
    }
    setTimeout(() => {
      Taro.navigateBack();
    }, 500);
  };

  /**
   * 退款回调提示
   */
  const onRefundCallback = (isSuccess = true) => {
    if (isSuccess) {
      setTimeout(() => {
        Taro.showToast({
          title: `申请成功`,
          icon: 'none',
        });
      }, 200);
    } else {
      Taro.showToast({
        title: `申请失败`,
        icon: 'none',
      });
    }
    setShowPopupRefund(false);
    setTimeout(() => {
      requestForDetail(orderTotalId);
    }, 500);
  };

  /**
   * 发起支付
   */
  const initPayment = async () => {
    await payment(
      orderTotal?.prepayId as string,
      () => onPayCallback(),
      () => onPayCallback(false)
    );
  };

  /**
   * 发起退款
   */
  const initRefund = async (orderIds: string[]) => {
    await refund(
      orderTotal?.id as string,
      orderIds,
      () => onRefundCallback(),
      () => onRefundCallback(false)
    );
  };

  const requestForDetail = async (id?: string) => {
    if (!id) return;
    const orderTotal = await request
      .get<IOrderTotal>('/order/detail', {
        id,
      })
      .finally(() => {
        setLoading(false);
      });
    // 计算子订单状态
    orderTotal.children.forEach((order) => computeOrderStatus(order));
    // 计算总订单状态
    computeOrderTotalStatus(orderTotal);
    // 获取展示的订单列表
    const displayOrderList = getDisplayOrderList(orderTotal.children);
    setOrderTotal(orderTotal);
    setDisplayOrderList(displayOrderList);
  };

  const router = useRouter();
  useEffect(() => {
    // 获取路由参数id
    const id = router.params.id;
    // 获取路由参数type，页面类型
    const type = router.params.type as DetailPageType;
    setPageType(type);
    setOrderTotalId(id);
    requestForDetail(id);
  }, []);

  // const refundTotalPrice = () => {
  //   return (
  //     orderTotal?.children
  //       .filter((order) => order._status === EnumOrderStatus.PAID)
  //       .reduce((sum, order) => sum + order.price, 0) || 0
  //   );
  // };

  const formatUnit = (unit: string) => {
    return unit === '票' ? '张' : '份';
  };

  // const goRefundPopup = (displayList: IOrderDisplay[]) => {
  //   const list: IRefundDisplay[] = JSON.parse(JSON.stringify(displayList));
  //   list.forEach((item: IRefundDisplay) => {
  //     item.children = item.children?.filter(
  //       (order) => order.status === EnumOrderStatus.PAID
  //     );
  //     item.refundNumber = item.children?.length || 0;
  //   });
  //   setRefundDisplayList(list.filter((item) => item.children?.length));
  //   setShowPopupRefund(true);
  // };

  const [showPopupRefund, setShowPopupRefund] = useState(false);
  const [refundDisplayList, setRefundDisplayList] =
    useState<IRefundDisplay[]>();

  return (
    <View className="order-detail">
      <LoadingPage loading={loading} />
      <Dialog id="refund" />
      <View className="nav-bar">
        <View style={{ height: `${barHeight}px`, width: '100%' }}></View>
        <NavBar
          back={<ArrowLeft size={16} />}
          onBackClick={() => Taro.navigateBack()}>
          <View>订单详情</View>
        </NavBar>
      </View>
      <View className="content">
        <View className="reserve-title">
          <View className="avatar">
            <Avatar
              size="28"
              icon={orderTotalIconFormat(
                orderTotal?._status as EnumOrderTotalStatus
              )}
              shape="round"
            />
            {orderTotal?._status &&
              orderTotalStatusFormat(
                orderTotal?._status as EnumOrderTotalStatus
              )}
          </View>
          <Image src={`${domain}/images/login-title.png`} />
        </View>
        <Cell.Group divider={false}>
          <Cell
            className="text-1"
            title={`商品总额 ${priceToString(orderTotal?.price)}`}
          />
        </Cell.Group>

        <Cell.Group divider={false}>
          <Cell className="text-1" title="GO FARM趣农场" />
          <Cell>
            <View className="order-box">
              <View className="order-top">
                <View className="text-3">订单商品：</View>
                {orderTotal?._status === EnumOrderTotalStatus.UNUSED && (
                  <View
                    className="text-4"
                    style={{ fontWeight: 600 }}
                    onClick={goTicketPage}>
                    查看门票
                  </View>
                )}
              </View>
              {displayOrderList.map((display) => {
                return (
                  <View className="order-items" key={display.id}>
                    <View className="order-item" style={{ marginBottom: 8 }}>
                      <View className="order-item-title">
                        <View className="title text-2">
                          {display.name.split(' ')[0]}
                        </View>
                        <View className="number text-2">
                          <Text style={{ fontWeight: 600 }}>x</Text>{' '}
                          {display.number} {formatUnit(display.attribute.type)}
                        </View>
                      </View>
                      <View>{priceToString(display.price)}</View>
                    </View>
                    {/* 申请退款按钮 */}
                    {/* {display.children?.find(
                      (order) => order._status === EnumOrderStatus.PAID
                    ) && (
                      <View
                        className="order-item"
                        style={{ margin: '8px 0 4px 0' }}>
                        <View />
                        <Button
                          size="mini"
                          onClick={() => goRefundPopup([display])}>
                          申请退款
                        </Button>
                      </View>
                    )} */}
                    {display.children?.map((order) => (
                      <View className="order-item">
                        <View className="text-6" style={{ margin: '4px 0' }}>
                          {order.id?.slice(-12)}
                        </View>
                        <View className="text-6">
                          {orderStatusFormat(order._status)}
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </Cell>
          <Cell>
            <Text className="text-3">有效日期：</Text>
            <Text className="text-2">
              仅限{formatDate(displayOrderList[0]?.name.split(' ')[1])}当日使用
            </Text>
          </Cell>
          <Cell>
            <Text className="text-3">使用方法：</Text>
            <Text className="text-2">农场正门扫码入园</Text>
          </Cell>
          <Cell>
            <Text className="text-3">入园时间：</Text>
            <Text className="text-2">09:30 - 16:30</Text>
          </Cell>
          <Cell>
            <Text className="text-3" style={{ flexShrink: 0 }}>
              农场地址：
            </Text>
            <Text className="text-2">
              湖州市吴兴区东林镇钓妙线望乡岭西911米
            </Text>
          </Cell>
          <Cell>
            <Text className="text-3">订单号：</Text>
            <Text className="text-2">{orderTotal?.id}</Text>
          </Cell>
          <Cell>
            <Text className="text-3">创建时间：</Text>
            <Text className="text-2">
              {formatDateTime(orderTotal?.createTime)}
            </Text>
          </Cell>
          {orderTotal?.payTime && (
            <Cell>
              <Text className="text-3">支付时间：</Text>
              <Text className="text-2">
                {formatDateTime(orderTotal?.payTime)}
              </Text>
            </Cell>
          )}
          <Cell className="text-4">
            11:30-12:10动物休息时间，所有动物互动关闭，游客需离开所有互动区域
          </Cell>
        </Cell.Group>
      </View>

      {/* 底部立即支付按钮 */}
      {pageType === DetailPageType.PAY && (
        <>
          <View className="empty"></View>
          <View className="bottom-box">
            <View className="total-price">
              <View>实付：¥ {orderTotal?.price}</View>
              <ButtonOnce type="primary" onClick={initPayment}>
                立即支付
              </ButtonOnce>
            </View>
            <View className="empty"></View>
          </View>
        </>
      )}

      {/* 底部全部退款按钮 */}
      {/* {pageType === DetailPageType.DETAIL && refundTotalPrice() > 0 && (
        <>
          <View className="empty"></View>
          <View className="bottom-box">
            <View className="total-price">
              <View />
              <Button onClick={() => goRefundPopup(displayOrderList)}>
                申请退款
              </Button>
            </View>
            <View className="empty"></View>
          </View>
        </>
      )} */}

      {/* 底部退款弹出层 */}
      <Popup
        closeable
        lockScroll={false}
        visible={showPopupRefund}
        title="退款申请"
        position="bottom"
        onClose={() => {
          setShowPopupRefund(false);
        }}>
        <View className="refund-wrapper">
          <Cell.Group>
            {refundDisplayList?.map((display) => (
              <>
                <Cell>
                  <View className="refund-item-header">
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
                    <View className="refund-item-header-text">
                      {display.name.split(' ')[0]}
                    </View>
                  </View>
                </Cell>
                <Cell
                  align="center"
                  title="退款数量"
                  description={`最多可退${display.children?.length}张`}
                  extra={
                    <ConfigProvider theme={customInputTheme}>
                      <InputNumber
                        value={display.refundNumber}
                        max={display.children?.length || 0}
                        min={0}
                        onChange={(value) =>
                          setRefundDisplayList(
                            refundDisplayList?.map((item) =>
                              item.id === display.id
                                ? { ...item, refundNumber: value as number }
                                : item
                            )
                          )
                        }
                      />
                    </ConfigProvider>
                  }
                />
                <Cell
                  align="center"
                  title="退款金额"
                  description="1-3个工作日退还至微信账户"
                  extra={priceToString(display.price * display.refundNumber)}
                />
              </>
            ))}
          </Cell.Group>
          <View
            className="total-price"
            style={{ boxSizing: 'border-box', padding: '0 20px' }}>
            <View>
              {priceToString(
                refundDisplayList?.reduce((pre, current) => {
                  return pre + current.price * current.refundNumber;
                }, 0)
              )}
            </View>
            <ButtonOnce
              onClick={() =>
                initRefund(
                  getRefundOrderIds(refundDisplayList as IRefundDisplay[])
                )
              }>
              申请退款
            </ButtonOnce>
          </View>
          <View className="empty" style={{ height: 32 }} />
        </View>
      </Popup>
    </View>
  );
}
