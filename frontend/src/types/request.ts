export type RequestResult<T = any> = {
  code: number;
  message: string;
  data: T;
};

export type FailedRequestResult = Omit<RequestResult, 'data'>;
