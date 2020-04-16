// export type DeepPartial<T> = {
//   [P in keyof T]?: DeepPartial<T[P]>;
// };

export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
