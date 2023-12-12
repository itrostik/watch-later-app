"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";

export default function Account() {
  const [activeItem, setActiveItem] = useState("/account");

  return (
    <div>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
    </div>
  );
}
