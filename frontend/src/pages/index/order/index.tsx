import LoadingPage from '@/components/loading-page';
import CardOrder from './components/card-order';
import request from '@/utils/request';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { Button, Dialog, Empty, NavBar, Tabs } from '@nutui/nutui-react-taro';
import Taro, { useDidShow } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { IUser } from '@/types/user';
import { waitForRender } from '@/utils/render';
import { domain } from '@/utils/request';
import { fetchUser, getUser } from '@/utils/user';
import {
  computeOrderStatus,
  computeOrderTotalStatus,
  EnumOrderTotalStatus,
  IOrderTotal,
} from '@/types/order';
import './index.less';

const filterUnPaid = (orderTotalList: IOrderTotal[]) => {
  return orderTotalList.filter(
    (orderTotal) => orderTotal._status === EnumOrderTotalStatus.UNPAID
  );
};
const filterUnUsed = (orderTotalList: IOrderTotal[]) => {
  return orderTotalList.filter(
    (orderTotal) => EnumOrderTotalStatus.UNUSED === orderTotal._status
  );
};
// const filterRefund = (orderTotalList: IOrderTotal[]) => {
//   return orderTotalList.filter((orderTotal) =>
//     [EnumOrderTotalStatus.REFUNDING, EnumOrderTotalStatus.REFUNDED].includes(
//       orderTotal._status
//     )
//   );
// };

const entryRender = (list: any[]) => {
  if (list.length) return list;
  return (
    <View className="empty-box">
      <Empty
        image={<img src={`${domain}/images/empty.png`} alt="" />}
        title="暂无订单"
        description="小动物们正在赶来～">
        <Button
          type="primary"
          className="empty-box-button"
          onClick={() =>
            Taro.navigateTo({ url: '/pages/ticket-notice/index' })
          }>
          去购买
        </Button>
      </Empty>
    </View>
  );
};

export default function Index() {
  const barHeight = useSelector((state: any) => state.system.barHeight);
  const [user, setUser] = useState(getUser());
  const [tabvalue, setTabvalue] = useState<string | number>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [orderTotals, setOrderTotals] = useState<IOrderTotal[]>([]);

  const requestForOrders = useCallback(
    async (newUser?: IUser) => {
      const orderTotals = await request
        .get<IOrderTotal[]>('/order', {
          userId: user?.id || newUser?.id,
        })
        .finally(() => {
          waitForRender(() => setLoading(false));
        });
      orderTotals.forEach((orderTotal) => {
        computeOrderTotalStatus(orderTotal);
        orderTotal.children.forEach((order) => computeOrderStatus(order));
      });
      setOrderTotals(orderTotals);
    },
    [user]
  );

  useDidShow(() => {
    const _user = getUser();
    if (_user) {
      fetchUser(_user.id).then((res) => setUser(res));
      requestForOrders(_user);
    } else {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    requestForOrders();
  }, []);

  return (
    <View className="order">
      <LoadingPage loading={loading} />
      <Dialog id="cancel" />
      <View className="nav-bar">
        <View style={{ height: `${barHeight}px`, width: '100%' }}></View>
        <NavBar>我的订单</NavBar>
      </View>
      <Tabs
        value={tabvalue}
        onChange={(value) => {
          setTabvalue(value);
        }}>
        <Tabs.TabPane title="全部">
          {entryRender(
            orderTotals.map((orderTotal) => (
              <CardOrder
                key={orderTotal.id}
                orderTotal={orderTotal}
                refreshList={requestForOrders}
              />
            ))
          )}
        </Tabs.TabPane>
        <Tabs.TabPane title="待付款">
          {entryRender(
            filterUnPaid(orderTotals).map((orderTotal) => (
              <CardOrder
                key={orderTotal.id}
                orderTotal={orderTotal}
                refreshList={requestForOrders}
              />
            ))
          )}
        </Tabs.TabPane>
        <Tabs.TabPane title="待使用">
          {entryRender(
            filterUnUsed(orderTotals).map((orderTotal) => (
              <CardOrder
                key={orderTotal.id}
                orderTotal={orderTotal}
                refreshList={requestForOrders}
              />
            ))
          )}
        </Tabs.TabPane>
        {/* <Tabs.TabPane title="退款">
          {entryRender(
            filterRefund(orderTotals).map((orderTotal) => (
              <CardOrder
                key={orderTotal.id}
                orderTotal={orderTotal}
                refreshList={requestForOrders}
              />
            ))
          )}
        </Tabs.TabPane> */}
      </Tabs>
    </View>
  );
}
