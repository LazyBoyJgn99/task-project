import Taro from '@tarojs/taro';
import LoadingPage from '@/components/loading-page';
import { useEffect, useState } from 'react';
import { Image, NavBar } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import { useDispatch, useSelector } from 'react-redux';
import { setMapUrl } from '@/store/image-slice';
import { waitForRender } from '@/utils/render';
import { domain } from '@/utils/request';
import './index.less';

const preloadImage = async (url: string) => {
  const file = await Taro.downloadFile({ url });
  return file.tempFilePath;
};

export default function Index() {
  const barHeight = useSelector((state: any) => state.system.barHeight);
  const mapUrl = useSelector((state: any) => state.image.mapUrl);
  // 暂时用不到mapTipsUrl，已经合并成一张了
  const mapTipsUrl = useSelector((state: any) => state.image.mapTipsUrl);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!mapUrl) {
      Promise.all([preloadImage(`${domain}/images/map.png`)]).then((urls) => {
        if (urls[0]) dispatch(setMapUrl(urls[0]));
        waitForRender(() => setLoading(false));
      });
    } else {
      waitForRender(() => setLoading(false));
    }
  }, []);

  const previewImage = (url: string) => {
    Taro.previewImage({
      current: url,
      urls: [mapUrl, mapTipsUrl],
    });
  };

  return (
    <View className="map">
      <LoadingPage loading={loading} />
      <View className="title-box">
        <View style={{ height: `${barHeight}px`, width: '100%' }}></View>
        <NavBar>
          <View>GO FARM 地图</View>
        </NavBar>
      </View>
      <View className="map-image" onClick={() => previewImage(mapUrl)}>
        <Image src={mapUrl} />
      </View>
    </View>
  );
}
