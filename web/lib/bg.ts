/**
 * Bulgarian UI copy (single locale for the app).
 */
export const bg = {
  meta: {
    title: "Бюджет — Delliesign и Елена",
    description:
      "Личен и бизнес бюджет с приходи, разходи, фиксирани и променливи статии. Данните остават в браузъра ви.",
    howToTitle: "Как се ползва — Delliesign и Елена",
    howToDescription:
      "Ръководство за сметки, приходи и разходи, изчисления, шаблони и трансфери.",
  },

  common: {
    loading: "Зареждане…",
    cancel: "Отказ",
    save: "Запази",
    add: "Добави",
    edit: "Редакция",
    delete: "Изтрий",
    remove: "Премахни",
    label: "Наименование",
    amount: "Сума",
    type: "Тип",
    category: "Категория",
    repeats: "Повторение",
  },

  frequency: {
    weekly: "Седмично",
    biweekly: "На две седмици",
    monthly: "Месечно",
    yearly: "Годишно",
  },

  frequencyShort: {
    weekly: "/сед.",
    biweekly: "/2 сед.",
    monthly: "/мес.",
    yearly: "/год.",
  },

  flow: {
    income: "Приход",
    expense: "Разход",
  },

  kind: {
    fixed: "Фиксиран (повтарящ се)",
    variable: "Променлив",
  },

  dashboard: {
    eyebrow: "Домашен бюджет",
    title: "Delliesign · Елена",
    subtitle: (biz: string, pers: string) =>
      `Следете бизнеса (${biz}) и личното (${pers}) на едно място. Данните остават само в този браузър.`,
    howToUse: "Как се ползва",
    accountTabs: "Сметка",
    resetConfirm: (short: string, label: string) =>
      `Изчистване на всички приходи и разходи за ${short} (${label})?`,
    reset: "Нулирай тази сметка",
    incomes: "Приходи",
    expenses: "Разходи",
    incomeFixedTitle: "Фиксиран (повтарящ се)",
    incomeFixedDesc:
      "Една и съща сума по график — нормализирано до месечна стойност.",
    incomeVarTitle: "Променлив",
    incomeVarDesc:
      "Нередовен или променящ се приход — въведете като месечна оценка.",
    expenseFixedTitle: "Фиксиран (повтарящ се)",
    expenseFixedDesc: "Наем, абонаменти и т.н. — сума за периода на повторение.",
    expenseVarTitle: "Променлив",
    expenseVarDesc: "Храна, свободни разходи — месечна бюджетна оценка.",
    breakdownShow: "Разбивка",
    breakdownHide: "Скрий",
    breakdownEmpty: "Няма записи за тази сметка.",
    breakdownRegionIncome: "Детайли по приходите",
    breakdownRegionExpense: "Детайли по разходите",
  },

  entry: {
    perMonth: "/мес.",
    estPerMonth: " оцен./мес.",
    toMonthly: (s: string) => `→ ${s}/мес.`,
    empty: "Няма записи",
    removeConfirm: (name: string) => `Премахване на „${name}“?`,
    placeholderLabel: "напр. заплата",
    placeholderAmount: "0",
  },

  financial: {
    title: "Финансов преглед",
    intro:
      "Месечни стойности (нормализирани). Резервът за данъци е само върху бизнес приходите (15%).",
    totalIncome: "Общ приход",
    totalExpenses: "Общ разход",
    taxReserve: "Резерв за данъци",
    taxSubBusiness: "15% от бизнес прихода",
    taxSubPersonal: "Не се моделира тук",
    annualHint: (s: string) => `≈ ${s} / г. при стабилен приход`,
    freeMoney: "Свободни пари",
    freeMoneyFormula: "Приход − разход − резерв за данъци",
  },

  templates: {
    title: "Шаблони",
    intro:
      "Запазете повтарящи се редове (заплата, наем, фитнес, кредит) с фиксирана сума и категория. Всеки месец ги заредете с едно действие, коригирайте при нужда и добавете към бюджета на сметката.",
    loadButton: "Зареди от шаблони…",
    empty: "Все още няма шаблони — ползвайте формата по-долу.",
    newTemplate: "Нов шаблон",
    editTemplate: "Редакция на шаблон",
    saveTemplate: "Запази шаблона",
    addTemplate: "Добави шаблон",
    placeholderLabel: "напр. заплата, наем, Multisport",
    removeConfirm: (name: string) => `Премахване на шаблон „${name}“?`,
  },

  loadModal: {
    title: "Зареждане на шаблони за този месец",
    subtitle: (short: string, label: string) =>
      `${short} (${label}) — редактирайте суми или категории, после добавете към бюджета.`,
    empty: "Все още няма запазени шаблони. Първо добавете шаблони в секцията по-долу.",
    include: (name: string) => `Включи ${name}`,
    addToBudget: "Добави към бюджета",
    alertInvalid: "Проверете всички включени редове — наименование и валидна сума.",
    alertNone: "Изберете поне един ред за добавяне.",
  },

  transfer: {
    titleTo: (short: string, label: string) => `Трансфер към ${short} (${label})`,
    titleFrom: (short: string, label: string) => `Трансфери от ${short} (${label})`,
    intro:
      "Преместване на заплата или теглене между сметки. Сумата се отчита като разход в бизнес бюджета и като приход в личния — по-долу е историята на трансферите.",
    totalOut: "Изпратено към личното (общо)",
    totalIn: "Получено от бизнеса (общо)",
    noteOptional: "Бележка (по желание)",
    placeholderNote: "напр. заплата за януари",
    record: "Запиши трансфер",
    hintPersonal:
      "За добавяне на трансфер отворете раздела Бизнес и го запишете там.",
    empty: "Все още няма записани трансфери.",
    arrowToPersonal: "→ Лично",
    arrowFromBusiness: "← Бизнес",
    removeConfirm:
      "Премахване на този трансфер? Ще се премахнат и свързаните разход (бизнес) и приход (лично), ако са записани.",
    ariaAmount: "Сума на трансфера",
    entryBusinessExpense: "Трансфер към лична сметка",
    entryPersonalIncome: "Трансфер от бизнес сметка",
  },

  categoryHelpers: {
    income: "Приход",
    expense: "Разход",
    fixed: "Фиксиран",
    variable: "Променлив",
  },
} as const;

export function categoryLabelBg(
  flow: "income" | "expense",
  kind: "fixed" | "variable",
): string {
  const side = flow === "income" ? bg.categoryHelpers.income : bg.categoryHelpers.expense;
  const cat = kind === "fixed" ? bg.categoryHelpers.fixed : bg.categoryHelpers.variable;
  return `${side} · ${cat}`;
}
