"use client";

import React from "react";
import { iconSet, IconName, type IconProps } from "./IconSet";

const iconEntries = Object.entries(iconSet) as [IconName, React.FC<IconProps>][];

const IconGrid: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className,
}) => (
  <div
    className={
      className ??
      "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-6"
    }
  >
    {iconEntries.map(([name, Icon]) => (
      <div
        key={name}
        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        title={name}
      >
        <Icon size={size} className="text-[#8B5CF6]" />
        <span className="text-[10px] text-[#64748B] text-center leading-tight break-all">
          {name}
        </span>
      </div>
    ))}
  </div>
);

export default IconGrid;
