import { BaseEventOrig, Button, ButtonProps } from '@tarojs/components';
import request from '@/utils/request';
import Taro from '@tarojs/taro';
import './index.less';

interface IProps {
  isRead: boolean;
  onSuccess: (phone: string) => void;
  children: React.ReactNode;
}

export default function Index(props: IProps) {
  const getPhoneNumber = async (
    e: BaseEventOrig<ButtonProps.onGetPhoneNumberEventDetail>
  ) => {
    const code = e.detail?.code;
    if (!code) return;
    const phoneNumber = await request.get<string>('/user/phone/by-phone-code', {
      code,
    });
    props.onSuccess(phoneNumber);
  };

  const goRead = () => {
    Taro.showToast({
      title: '请阅读并同意隐私政策',
      icon: 'none',
    });
  };

  return (
    <>
      {props.isRead && (
        <Button
          className="button-get-phone"
          open-type="getPhoneNumber"
          onGetPhoneNumber={getPhoneNumber}>
          {props.children}
        </Button>
      )}
      {!props.isRead && (
        <Button className="button-get-phone" onClick={goRead}>
          {props.children}
        </Button>
      )}
    </>
  );
}
