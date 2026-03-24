'use client';

import * as React from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Star, Check, RotateCcw, Truck, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [priceRange, setPriceRange] = React.useState([500, 50000]);

  return (
    <aside className={cn("sticky top-20 h-[calc(100vh-100px)] w-[240px] space-y-6 overflow-y-auto pr-3 pb-6", className)}>
      {/* Price Range */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Price Range</h3>
          <button className="flex items-center gap-1 text-[10px] font-bold text-muted transition-colors hover:text-primary">
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <p className="mb-5 text-[9px] items-center gap-1 text-muted font-bold">
          Avg. <span className="text-primary tracking-tight">₦12,500</span>
        </p>

        <Slider.Root
          className="relative mb-5 flex h-1 w-full touch-none items-center select-none"
          defaultValue={[500, 50000]}
          max={100000}
          step={500}
          value={priceRange}
          onValueChange={setPriceRange}
        >
          <Slider.Track className="relative h-1 grow rounded-full bg-border">
            <Slider.Range className="absolute h-full rounded-full bg-primary" />
          </Slider.Track>
          <Slider.Thumb className="block h-3.5 w-3.5 rounded-full border-2 border-primary bg-white shadow-sm focus:outline-none" />
          <Slider.Thumb className="block h-3.5 w-3.5 rounded-full border-2 border-primary bg-white shadow-sm focus:outline-none" />
        </Slider.Root>

        <div className="flex items-center justify-between">
          <div className="flex w-[46%] items-center gap-1 rounded-lg border-2 border-border/40 bg-white p-2">
            <span className="text-[9px] font-bold text-muted">₦</span>
            <span className="text-xs font-black text-foreground">{priceRange[0].toLocaleString()}</span>
          </div>
          <div className="h-[2px] w-2 rounded-full bg-border" />
          <div className="flex w-[46%] items-center gap-1 rounded-lg border-2 border-border/40 bg-white p-2">
            <span className="text-[9px] font-bold text-muted">₦</span>
            <span className="text-xs font-black text-foreground">{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Star Rating */}
      <section>
        <h3 className="mb-3 text-[10px] font-black uppercase tracking-widest text-foreground">Star Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2].map((rating) => (
            <div key={rating} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < rating ? "fill-accent text-accent" : "fill-border/50 text-border"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-muted group-hover:text-foreground">{rating} Stars & up</span>
              </div>
              <Checkbox.Root className="h-3.5 w-3.5 rounded-md border-2 border-border bg-white outline-none data-[state=checked]:border-primary data-[state=checked]:bg-primary transition-all">
                <Checkbox.Indicator>
                  <Check className="h-2.5 w-2.5 text-white stroke-[3.5]" />
                </Checkbox.Indicator>
              </Checkbox.Root>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Categories</h3>
          <button className="text-[9px] font-black uppercase text-primary tracking-widest hover:underline">See All</button>
        </div>
        <div className="space-y-3">
          {['Grains & Tubers', 'Poultry', 'Livestock', 'Vegetables', 'Fruits'].map((cat) => (
            <div key={cat} className="flex items-center justify-between group cursor-pointer">
              <span className="text-[10px] font-bold text-muted group-hover:text-primary transition-colors">{cat}</span>
              <Checkbox.Root className="h-3.5 w-3.5 rounded-md border-2 border-border bg-white outline-none data-[state=checked]:border-primary data-[state=checked]:bg-primary transition-all">
                <Checkbox.Indicator>
                  <Check className="h-2.5 w-2.5 text-white stroke-[3.5]" />
                </Checkbox.Indicator>
              </Checkbox.Root>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Options */}
      <section>
        <h3 className="mb-3 text-[10px] font-black uppercase tracking-widest text-foreground">Delivery</h3>
        <ToggleGroup.Root
          type="single"
          defaultValue="standard"
          className="inline-flex w-full items-center gap-1 rounded-xl bg-border/20 p-1"
        >
          <ToggleGroup.Item
            value="standard"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[9px] font-black uppercase tracking-widest text-muted transition-all data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm"
          >
            <Truck className="h-3 w-3" />
            Basic
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value="pickup"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[9px] font-black uppercase tracking-widest text-muted transition-all data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm"
          >
            <MapPin className="h-3 w-3" />
            Pickup
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </section>
    </aside>
  );
}
