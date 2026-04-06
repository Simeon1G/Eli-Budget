import type { Metadata } from "next";
import Link from "next/link";
import { bg } from "@/lib/bg";

export const metadata: Metadata = {
  title: bg.meta.howToTitle,
  description: bg.meta.howToDescription,
};

export default function HowToUsePage() {
  return (
    <div className="mx-auto min-h-full w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="mb-6">
        <Link
          href="/"
          className="text-sm font-semibold text-orange-900/90 underline-offset-2 hover:text-orange-950 hover:underline dark:text-orange-300/90 dark:hover:text-orange-200"
        >
          ← Към бюджета
        </Link>
      </p>

      <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.35em] text-orange-800/90 dark:text-orange-300/90">
        Ръководство
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
        Как се ползва приложението
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-stone-600 dark:text-stone-400">
        Обяснение с прости думи какво прави всяка част и как се смятат числата.
      </p>

      <div className="mt-10 space-y-10 text-stone-700 dark:text-stone-300">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
            Основи
          </h2>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed sm:list-outside sm:pl-5">
            <li>
              Всичко се пази <strong>в браузъра ви</strong> (локално хранилище).
              Ако изчистите данните на сайта или ползвате друго устройство,
              бюджетите там са отделни.
            </li>
            <li>
              Има <strong>две сметки</strong>:{" "}
              <strong>бизнес (Delliesign)</strong> и{" "}
              <strong>лично (Елена)</strong>. Всяка има свой списък с приходи и
              разходи. Сменяйте раздела, за да редактирате избраната сметка.
            </li>
            <li>
              Сумите в прегледа са като{" "}
              <strong>месечни еквиваленти</strong>, за да можете да сравнявате
              различни периоди на една скала.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
            Приходи и разходи
          </h2>
          <p className="text-sm leading-relaxed">
            При всяка сметка имате <strong>Приходи</strong> и{" "}
            <strong>Разходи</strong>. Вътре редовете са{" "}
            <strong>фиксирани (повтарящи се)</strong> или{" "}
            <strong>променливи</strong>.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed sm:list-outside sm:pl-5">
            <li>
              <strong>Фиксиран</strong>: въвеждате сумата за един период и колко
              често се повтаря (седмично, на две седмици, месечно, годишно).
              Приложението я превежда в приблизителна{" "}
              <strong>месечна</strong> стойност по правилата по-долу.
            </li>
            <li>
              <strong>Променлив</strong>: въвеждате{" "}
              <strong>месечна оценка</strong> (за неравномерни или променящи се
              суми). Без допълнително преизчисление.
            </li>
          </ul>
          <div className="rounded-xl border border-stone-200 bg-white/90 p-4 text-sm shadow-sm dark:border-stone-800 dark:bg-stone-900/60">
            <p className="font-semibold text-stone-900 dark:text-stone-100">
              Фиксиран → месечен еквивалент
            </p>
            <ul className="mt-2 space-y-1 font-mono text-xs text-stone-800 dark:text-stone-200 sm:text-sm">
              <li>Седмично: сума × 52 ÷ 12</li>
              <li>На две седмици: сума × 26 ÷ 12</li>
              <li>Месечно: както е въведено</li>
              <li>Годишно: сума ÷ 12</li>
            </ul>
          </div>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            <strong>Общ приход</strong> (или разход) за сметката е сумата на тези
            месечни еквиваленти по всички редове от съответния тип.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
            Финансов преглед
          </h2>
          <p className="text-sm leading-relaxed">
            В горната част на началната страница <strong>Финансов преглед</strong>{" "}
            показва два картона: бизнес и лично.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed sm:list-outside sm:pl-5">
            <li>
              <strong>Общ приход</strong> / <strong>Общ разход</strong>: месечни
              суми за съответната сметка (бизнес или лично). С бутона{" "}
              <strong>Разбивка</strong> се отваря списък с отделните редове и
              суми /мес.
            </li>
            <li>
              <strong>Резерв за данъци (бизнес)</strong>: приблизителна месечна
              отбивка за данъци върху бизнес прихода. Формулата е:
              <span className="mx-1 rounded bg-orange-50 px-1.5 py-0.5 font-mono text-xs text-stone-900 dark:bg-orange-950/50 dark:text-stone-100">
                резерв = 15% × общ месечен бизнес приход
              </span>
              (същият общ приход като на картона за бизнеса).
            </li>
            <li>
              <strong>Резерв за данъци (лично)</strong>: приложението не моделира
              лични данъци; за личното се показва <strong>0 €</strong>.
            </li>
            <li>
              <strong>Свободни пари</strong>:{" "}
              <span className="font-mono text-xs text-stone-800 dark:text-stone-200">
                приход − разход − резерв за данъци
              </span>{" "}
              за съответния картон. Това е планинг число, не салдо по сметка.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
            Шаблони
          </h2>
          <p className="text-sm leading-relaxed">
            <strong>Шаблоните</strong> запазват повтарящи се редове (заплата,
            наем, фитнес и т.н.) с тип, категория, сума и период. Запазват се по
            сметка.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed sm:list-outside sm:pl-5">
            <li>
              <strong>Зареди от шаблони</strong> отваря списък — включвате или
              пропускате редове, редактирате суми и категории, после{" "}
              <strong>Добави към бюджета</strong>. Това{" "}
              <strong>добавя</strong> нови записи; не замества старите.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
            Трансфери (бизнес → лично)
          </h2>
          <p className="text-sm leading-relaxed">
            Когато прехвърляте пари между сметки (напр. заплата от бизнеса към
            личното), ползвайте <strong>Запиши трансфер</strong> в раздела
            бизнес. За всяка сума се добавя{" "}
            <strong>разход</strong> в бизнес бюджета и{" "}
            <strong>приход</strong> в личния; списъкът по-долу е история на
            трансферите. При премахване на запис от списъка се махат и двата
            свързани реда в бюджетите.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
            Нулиране и ключове за данни
          </h2>
          <p className="text-sm leading-relaxed">
            <strong>Нулирай тази сметка</strong> изчиства приходите и разходите
            само за избраната сметка. Не изтрива шаблони и трансфери.
          </p>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            Технически: данните са под ключове като{" "}
            <code className="rounded bg-stone-200/90 px-1.5 py-0.5 text-xs dark:bg-stone-800">
              budget-tracker-v1
            </code>
            ,{" "}
            <code className="rounded bg-stone-200/90 px-1.5 py-0.5 text-xs dark:bg-stone-800">
              budget-templates-v1
            </code>{" "}
            и{" "}
            <code className="rounded bg-stone-200/90 px-1.5 py-0.5 text-xs dark:bg-stone-800">
              budget-transfers-v1
            </code>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
