import { Order } from "@/types/tableTypes";
import { descendingComparator } from "./descendingComparator";

export function getComparator<Key extends keyof any | 'action'>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}