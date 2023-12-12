"use client";

import Header from "@/components/Header/Header";
import { useState } from "react";

export default function Search() {
  const [activeItem, setActiveItem] = useState("/search");
  return (
    <div>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
    </div>
  );
}
