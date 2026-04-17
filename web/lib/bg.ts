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
    resetConfirmMonth: (short: string, label: string, monthLabel: string) =>
      `Изчистване на всички приходи и разходи за ${short} (${label}) за ${monthLabel}?`,
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

  months: {
    title: "Месеци",
    intro:
      "Всеки месец има отделен бюджет. Списъкът е по години; по-новите месеци са по-нагоре. Календарният текущ месец е отбелязан.",
    selectedLabel: (monthLabel: string) => `Преглед: ${monthLabel}`,
    notCalendarMonth: "гледате друг месец",
    currentBadge: "Текущ",
    yearHeading: (y: number) => `${y} г.`,
    monthCountOne: "месец",
    monthCountMany: "месеца",
    pickMonth: "Месец",
    addMonth: "Добави или отвори",
    addNextMonth: "Празен следващ месец",
  },

  reports: {
    title: "Месечен PDF отчет",
    intro:
      "Изберете година и месец, после свалете чист PDF отчет за споделяне с счетоводител или партньор.",
    downloadButton: "Свали PDF отчет",
    selectedMonth: (monthLabel: string) => `За: ${monthLabel}`,
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
      "Стойностите са за избрания месец (месечни еквиваленти). За бизнеса: данъци и осигуровките от картата по-долу не са в „Разходи“ и не намаляват основата за 15% резерв — изваждат се отделно от прихода при свободните пари.",
    totalIncome: "Общ приход",
    totalExpenses: "Общ разход",
    businessTaxInsuranceLabel: "Данъци и осигуровки",
    businessTaxInsuranceSub:
      "Отделно от списъка „Разходи“; не влизат в 15% резерв (той е върху пълния приход)",
    taxReserve: "Резерв за данъци",
    taxSubBusiness: "15% от бизнес прихода",
    taxSubPersonal: "Не се моделира тук",
    taxReserveBreakdownRegion: "Разбивка на резерва за данъци",
    taxReserveBreakdownExplain:
      "Базата е общият месечен бизнес приход (нормализиран). Разходите по списъка и сумите от картата „Данъци и осигуровки“ не намаляват тази база.",
    taxReserveBaseLabel: "База (общ месечен приход)",
    taxReserveRateLabel: "Процент резерв",
    taxReserveResultLabel: "Резултат (месечно)",
    freeMoney: "Свободни пари",
    freeMoneyFormulaBusiness:
      "Приход − разход − данъци и осигуровки − резерв за данъци",
    freeMoneyFormulaPersonal: "Приход − разход",
    freeMoneyBreakdownRegion: "Разбивка на свободните пари",
    freeMoneyStepIncome: "Общ приход",
    freeMoneyStepExpenses: "Общ разход",
    freeMoneyStepTaxInsurance: "Данъци и осигуровки",
    freeMoneyStepReserve: "Резерв за данъци",
    freeMoneyStepResult: "Свободни пари (резултат)",
  },

  taxInsurance: {
    title: "Данъци и осигуровки",
    intro:
      "Част от бизнес бюджета (лв./мес.). Не се дублират в „Разходи“; резервът 15% се смята върху пълния бизнес приход, после тези суми се изваждат при свободните пари.",
    kd: "КД",
    dividendTax: "Данък дивидент",
    dzpo: "ДЗПО",
    zo: "ЗО",
    doo: "ДОО",
    dod: "ДОД",
    sumHint: "Сума (месечно)",
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
