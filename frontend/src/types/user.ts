export interface IUser {
  id: string;

  name: string;

  phone: string;

  openId: string;

  points: number;

  level: number;

  birthday: string;

  gender: string;

  cityCode: string;

  accessToken?: string;
}
