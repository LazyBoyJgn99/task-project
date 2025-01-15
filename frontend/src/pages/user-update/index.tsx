import { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import { IconFont } from '@nutui/icons-react-taro';
import { pcCode } from '@/utils/region-code';
import { IUser } from '@/types/user';
import { getUser, setUser } from '@/utils/user';
import Taro from '@tarojs/taro';
import request from '@/utils/request';
import {
  Avatar,
  Button,
  Cell,
  DatePicker,
  Form,
  Input,
  Picker,
  PickerOption,
} from '@nutui/nutui-react-taro';
import './index.less';

const genderList = [
  { value: '男', text: '男' },
  { value: '女', text: '女' },
];

const genderFormatter = (values: string[]) => {
  if (values?.length && values[0]) {
    return genderList.filter((po) => po.value === values[0])[0]?.text;
  }
  return '未知';
};

const cityFormatter = (values: string[]) => {
  for (const province of pcCode) {
    const city = province.children.find((city) => {
      return city.value === values[1];
    });
    if (city) {
      return city.text;
    }
  }
  return '请选择';
};

const getprovinceCodeByCityCode = (cityCode: string) => {
  for (const province of pcCode) {
    const city = province.children.find((city) => {
      return city.value === cityCode;
    });
    if (city) {
      return province.value;
    }
  }
  return '';
};

export default function Index() {
  const user: IUser = getUser();
  const [birthdayVisible, setBirthdayVisible] = useState(false);
  const [birthday, setBirthday] = useState('');

  const change = (_: PickerOption[], values: (string | number)[]) => {
    const value = values.join('-');
    setBirthday(value);
  };

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      name: user.name,
      phone: user.phone,
      gender: [user.gender],
      cityCode: [getprovinceCodeByCityCode(user.cityCode), user.cityCode],
    });
    setBirthday(user.birthday);
  }, []);

  const checkData = () => {
    if (!birthday) {
      Taro.showToast({
        title: '请选择生日',
        icon: 'none',
      });
      return false;
    }
    return true;
  };

  const updateUser = async () => {
    if (!checkData()) return;
    const params = {
      id: user.id,
      name: form.getFieldValue('name'),
      phone: form.getFieldValue('phone'),
      gender: form.getFieldValue('gender')[0],
      cityCode: form.getFieldValue('cityCode')[1],
      birthday,
    };
    await request.patch('/user', params);
    setUser({ ...user, ...params });
    Taro.showToast({
      title: '保存成功',
      icon: 'none',
    });
    setTimeout(() => {
      Taro.navigateBack();
    }, 500);
  };

  return (
    <View className="user-update">
      <Cell className="user-avatar">
        <View className="avatar-box">
          <Avatar
            icon={
              <IconFont
                fontClassName="icon"
                color="#000"
                classPrefix="go-farm"
                name="avatar"
              />
            }
            shape="round"
          />
        </View>
      </Cell>
      <View className="title">我的资料</View>
      <Form form={form} labelPosition="right" divider>
        <Form.Item
          label="昵称"
          name="name"
          rules={[{ max: 12, message: '昵称不能超过12个字' }]}>
          <Input placeholder="请输入昵称" type="text" />
        </Form.Item>
        <Form.Item label="手机" name="phone">
          <Input
            className="phone-input"
            disabled
            placeholder="请输入手机号"
            type="text"
          />
        </Form.Item>
        <Form.Item label="生日">
          <View
            className="birthday-input"
            onClick={() => {
              !user.birthday && setBirthdayVisible(true);
            }}>
            {birthday || '请选择生日'}
          </View>
        </Form.Item>
        <Form.Item
          label="性别"
          name="gender"
          trigger="onConfirm"
          getValueFromEvent={(...args) => args[1]}
          onClick={(_, ref: any) => {
            ref.open();
          }}>
          <Picker options={[genderList]}>
            {(value: any) => (
              <Cell
                style={{ padding: 0 }}
                title={genderFormatter(value)}
                className="nutui-cell--clickable"
                align="center"
              />
            )}
          </Picker>
        </Form.Item>
        <Form.Item
          label="城市"
          name="cityCode"
          trigger="onConfirm"
          getValueFromEvent={(...args) => args[1]}
          onClick={(_, ref: any) => {
            ref.open();
          }}>
          <Picker options={pcCode}>
            {(value: any) => (
              <Cell
                style={{ padding: 0 }}
                title={cityFormatter(value)}
                className="nutui-cell--clickable"
                align="center"
              />
            )}
          </Picker>
        </Form.Item>
      </Form>
      <Button
        className="button-submit"
        block
        type="primary"
        onClick={updateUser}>
        保存
      </Button>
      <DatePicker
        title="日期选择"
        startDate={new Date('1960-01-01')}
        visible={birthdayVisible}
        showChinese
        value={new Date(birthday)}
        onClose={() => setBirthdayVisible(false)}
        onConfirm={(options, values) => change(options, values)}
      />
    </View>
  );
}
