export type ShopItem = {
  id: string;
  name: string;
  type: "coin" | "heart" | "limited";
  coin: number;
  heart: number;
  price: number;
  active: boolean;
  limited: boolean;
};