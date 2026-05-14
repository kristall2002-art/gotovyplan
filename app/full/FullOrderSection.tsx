"use client";

import { useState } from "react";
import { BusinessContext } from "@/components/BusinessContext";
import { IdeaInput } from "@/components/IdeaInput";
import { OrderForm } from "@/components/OrderForm";

export function FullOrderSection() {
  const [idea, setIdea] = useState("");
  const [, setFile] = useState<File | null>(null);
  const [businessType, setBusinessType] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  const contextValid = Boolean(businessType && region.trim() && city.trim());

  return (
    <>
      <BusinessContext
        businessType={businessType}
        region={region}
        city={city}
        onBusinessTypeChange={setBusinessType}
        onRegionChange={setRegion}
        onCityChange={setCity}
      />

      <IdeaInput value={idea} onChange={setIdea} onFileChange={setFile} />

      <OrderForm
        tariff="full"
        basePrice={14990}
        buttonLabel="Заказать полный план за"
        idea={idea}
        businessType={businessType}
        region={region}
        city={city}
        contextValid={contextValid}
      />
    </>
  );
}
