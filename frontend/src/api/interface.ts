// 账本相关
export type LedgerId = number;
export type LedgerItem = {
  id: LedgerId;
  name: string;
}

// 分类相关
export type ClassificationId = number;
export type ClassificationItem = {
  id: ClassificationId;
  name: string;
  amount: number | 0; // 分类消费金额总数
  amount_rate: number | 0; // 分类消费金额占比
}

// 子分类相关
export type SubClassificationId = number;
export type SubClassificationItem = {
  id: SubClassificationId;
  name: string;
}

// 账单相关
export type RecordId = number;
export type RecordItem = {
  id: RecordId
  amount: string, // 金额
  ledger: string // 账本名称
  classification: string // 分类名称
  sub_classification: string, // 子分类名称
  consumption_time: string, // 账单时间
  note: string, // 备注
  type: string, // 账单类型
}