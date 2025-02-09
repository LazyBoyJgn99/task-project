import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Checkbox, NavBar } from '@nutui/nutui-react-taro';
import { Image, ITouchEvent, Text, View } from '@tarojs/components';
import { ArrowLeft } from '@nutui/icons-react-taro';
import { getUserCodeWX } from './pure';
import { domain } from '@/utils/request';
import { IUser } from '@/types/user';
import { setToken, setUser } from '@/utils/user';
import Taro from '@tarojs/taro';
import request from '@/utils/request';
import ButtonPhone from '@/components/button-phone';
import './index.less';

const goPrivacyPolicy = (event: ITouchEvent) => {
  event.stopPropagation();
  Taro.navigateTo({ url: '/pages/clause-privacy-policy/index' });
};

export default function Index() {
  const barHeight = useSelector((state: any) => state.system.barHeight);
  const [loggedPhone, setLoggedPhone] = useState<string>('');
  const [isRead, setIsRead] = useState<boolean>(false);

  /**
   * 获取用户的手机号，可能有也可能还没注册
   */
  const getRegistedPhone = async () => {
    const code = await getUserCodeWX();
    const phone = await request.get<string>('/user/phone/by-login-code', {
      code,
    });
    setLoggedPhone(phone || '');
  };

  /**
   * 进入页面时获取用户在系统中的手机号
   */
  useEffect(() => {
    getRegistedPhone();
  }, []);

  /**
   * 登录后把user存入redux
   */
  const afterLogin = (user: IUser) => {
    setUser(user);
    setToken(user.accessToken as string);
    Taro.navigateBack();
  };

  /**
   * 校验是否阅读隐私政策
   */
  const beforeLogin = () => {
    if (isRead) return true;
    Taro.showToast({
      title: '请阅读并同意隐私政策',
      icon: 'none',
    });
    return false;
  };

  /**
   * 已经有账号的情况下登录
   */
  const login = async () => {
    if (!beforeLogin()) return;
    const code = await getUserCodeWX();
    const user = await request.post<IUser>('/user/login', {
      code,
    });
    afterLogin(user);
  };

  /**
   * 没有账号的情况下注册并登录
   */
  const registerAndLogin = async (phone: string) => {
    if (!beforeLogin()) return;
    const code = await getUserCodeWX();
    const user = await request.post<IUser>('/user/register-login', {
      code,
      phone,
    });
    afterLogin(user);
  };

  return (
    <View className="login">
      <View style={{ height: `${barHeight}px`, width: '100%' }}></View>
      <NavBar
        back={<ArrowLeft size={18} />}
        onBackClick={() =>
          Taro.redirectTo({ url: '/pages/index/index' })
        }></NavBar>
      <View className="title">
        <Image
          className="login-title"
          src={`${domain}/images/login-title.png`}
        />
        <View className="title-text-1">国内首家体感式农场</View>
        <View className="title-text-2">动物作伴，开启一场奇妙的自然旅程！</View>
      </View>
      <View className="footer">
        {loggedPhone && (
          <Button shape="square" type="primary" onClick={login}>
            手机号一键登录
          </Button>
        )}
        {!loggedPhone && (
          <ButtonPhone isRead={isRead} onSuccess={registerAndLogin}>
            <View>手机号一键登录</View>
          </ButtonPhone>
        )}
      </View>
      <View className="clause">
        <Checkbox
          checked={isRead}
          onChange={(val) => setIsRead(val)}
          label={
            <>
              <Text>已阅读并同意</Text>
              <Text className="clause-link" onClick={goPrivacyPolicy}>
                《隐私政策》
              </Text>
            </>
          }
        />
      </View>
    </View>
  );
}
