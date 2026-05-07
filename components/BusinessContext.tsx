"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, MapPin } from "lucide-react";
import { BUSINESS_TYPES, RUSSIA_REGIONS } from "@/lib/regions";
import { Combobox } from "@/components/Combobox";
import { loadCities, citiesByRegion, type City } from "@/lib/cities";

interface Props {
  businessType: string;
  region: string;
  city: string;
  onBusinessTypeChange: (v: string) => void;
  onRegionChange: (v: string) => void;
  onCityChange: (v: string) => void;
}

export function BusinessContext({
  businessType,
  region,
  city,
  onBusinessTypeChange,
  onRegionChange,
  onCityChange,
}: Props) {
  const selectedHint = BUSINESS_TYPES.find((t) => t.value === businessType)?.hint;
  const [cities, setCities] = useState<City[] | null>(null);

  useEffect(() => {
    loadCities().then(setCities).catch(() => setCities([]));
  }, []);

  const cityOptions = useMemo(() => {
    if (!cities || !region) return [];
    return citiesByRegion(cities, region).map((c) => c.n);
  }, [cities, region]);

  const regionIsKnown = RUSSIA_REGIONS.includes(region);
  const cityListReady = cities !== null;

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2">Контекст бизнеса</h3>
      <p className="text-sm text-[var(--muted)] mb-5">
        Без этого мы не сможем посчитать конкурентов в твоём районе и налоги по
        твоему региону. Заполни — займёт 20 секунд.
      </p>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Briefcase size={14} className="text-[var(--accent)]" />
            Тип бизнеса
          </label>
          <select
            value={businessType}
            onChange={(e) => onBusinessTypeChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors appearance-none cursor-pointer"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='none' stroke='%2364748b' stroke-width='1.5' d='M1 1l5 5 5-5'/></svg>\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              paddingRight: "44px",
            }}
          >
            <option value="">Выбери категорию…</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {selectedHint && (
            <p className="mt-2 text-xs text-[var(--muted)]">{selectedHint}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin size={14} className="text-[var(--accent)]" />
              Регион
            </label>
            <Combobox
              value={region}
              onChange={(v) => {
                onRegionChange(v);
                if (v !== region) onCityChange("");
              }}
              options={RUSSIA_REGIONS}
              placeholder="Начни вводить — Москва, Рязанская…"
              emptyText="Не нашли регион — впишем как есть"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin size={14} className="text-[var(--accent)]" />
              Город / населённый пункт
            </label>
            <Combobox
              value={city}
              onChange={onCityChange}
              options={cityOptions}
              placeholder={
                !region
                  ? "Сначала выбери регион"
                  : !regionIsKnown
                  ? "Город — текстом"
                  : !cityListReady
                  ? "Грузим список городов…"
                  : "Например, Рязань"
              }
              emptyText={
                regionIsKnown && cityListReady && cityOptions.length === 0
                  ? "В этом регионе нет городов в нашей базе"
                  : "Города нет в списке — впишем как есть (учтём при анализе)"
              }
              disabled={!region}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
