export interface Response<T> {
  flag: boolean; // Two values: true means success, false means not success
  code: number; // Status code
  message: string; // Message
  data: T; // The response payload
}
