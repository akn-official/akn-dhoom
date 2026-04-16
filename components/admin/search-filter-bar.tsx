'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FilterOption {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface SearchFilterBarProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
}

export function SearchFilterBar({ searchPlaceholder, searchValue, onSearchChange, filters }: SearchFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D] pl-9"
        />
      </div>
      {filters?.map((filter) => (
        <select
          key={filter.label}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="h-10 rounded-md bg-zinc-950 border border-zinc-800 text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A8B9D] min-w-[140px]"
        >
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
    </div>
  );
}
