"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";

export default function Films() {
  const [activeItem, setActiveItem] = useState("/films/add");

  return (
    <div>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
    </div>
  );
}
