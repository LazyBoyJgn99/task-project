import { useRef, useState } from 'react';
import { Button, Cell, Dialog } from '@nutui/nutui-react-taro';
import { IUser } from '@/types/user';
import { View } from '@tarojs/components';
import {
  ArrowRight,
  Setting,
  Phone,
  Orderlist,
  PickedUp,
} from '@nutui/icons-react-taro';
import Taro from '@tarojs/taro';
import './options.less';

interface IProps {
  user: IUser;
}

export default function Index(props: IProps) {
  const { user } = props;
  const [visiableContactUs, setVisibleContactUs] = useState(false);
  const contactUsRef = useRef<HTMLButtonElement>(null);

  const goUserUpdatePage = () => {
    if (!user) {
      Taro.navigateTo({ url: '/pages/login/index' });
      return;
    }
    Taro.navigateTo({ url: '/pages/user-update/index' });
  };

  return (
    <>
      <Cell.Group className="mine-options">
        <Cell
          title={
            <View className="options-item">
              <Setting /> 设置
            </View>
          }
          extra={<ArrowRight size={14} />}
          onClick={goUserUpdatePage}
        />
        <Cell
          title={
            <View className="options-item">
              <Phone />
              <Button
                ref={contactUsRef}
                className="contact-us-button"
                type="primary"
                open-type="contact">
                联系我们
              </Button>
            </View>
          }
          extra={<ArrowRight size={14} />}
        />
        <Cell
          title={
            <View className="options-item">
              <PickedUp /> 关于我们
            </View>
          }
          extra={<ArrowRight size={14} />}
          onClick={() => Taro.navigateTo({ url: '/pages/about-us/index' })}
        />
        <Cell
          title={
            <View className="options-item">
              <Orderlist /> 条款
            </View>
          }
          extra={<ArrowRight size={14} />}
          onClick={() => Taro.navigateTo({ url: '/pages/clause-list/index' })}
        />
      </Cell.Group>
      <Dialog
        title="联系我们"
        visible={visiableContactUs}
        footerDirection="vertical"
        hideConfirmButton
        hideCancelButton
        onCancel={() => setVisibleContactUs(false)}
        footer={
          <Button type="primary" open-type="contact">
            联系客服
          </Button>
        }>
        <View className="line-contact-us">
          <View>手机号：13706525383</View>
        </View>
        <View className="line-contact-us">
          <View>微信号：gofarm2</View>
        </View>
      </Dialog>
    </>
  );
}
