import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Апгрейд тарифа — БП24",
  description:
    "Открой полную версию своего бизнес-плана. Введи номер заказа и email — пришлём код подтверждения.",
  robots: { index: false, follow: false },
};

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
