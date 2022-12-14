import { atom } from "jotai";

/* 사용자 정보 저장 */
export const userAtom = atom({
  user: undefined,
  signOut: () => {},
});
