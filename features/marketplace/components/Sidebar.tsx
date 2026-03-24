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
    <aside className={cn("sticky top-24 h-[calc(100vh-120px)] w-[280px] space-y-8 overflow-y-auto pr-4 pb-8", className)}>
      {/* Price Range */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Price Range</h3>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-primary">
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
        
        <p className="mb-6 text-[10px] items-center gap-1.5 text-muted">
          The average price is <span className="font-bold text-primary">₦12,500</span>
        </p>

        <Slider.Root
          className="relative mb-6 flex h-1 w-full touch-none items-center select-none"
          defaultValue={[500, 50000]}
          max={100000}
          step={500}
          value={priceRange}
          onValueChange={setPriceRange}
        >
          <Slider.Track className="relative h-1 grow rounded-full bg-border">
            <Slider.Range className="absolute h-full rounded-full bg-primary" />
          </Slider.Track>
          <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-white shadow-sm ring-offset-background transition-colors hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
          <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-white shadow-sm ring-offset-background transition-colors hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        </Slider.Root>

        <div className="flex items-center justify-between">
          <div className="flex w-[46%] items-center gap-1.5 rounded-lg border-2 border-border/40 bg-white p-2.5">
            <span className="text-[10px] font-bold text-muted">₦</span>
            <span className="text-sm font-bold text-foreground">{priceRange[0].toLocaleString()}</span>
          </div>
          <div className="h-[2px] w-2 rounded-full bg-border" />
          <div className="flex w-[46%] items-center gap-1.5 rounded-lg border-2 border-border/40 bg-white p-2.5">
            <span className="text-[10px] font-bold text-muted">₦</span>
            <span className="text-sm font-bold text-foreground">{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Star Rating */}
      <section>
        <h3 className="mb-4 text-sm font-bold text-foreground">Star Rating</h3>
        <div className="space-y-3">
          {[4, 3, 2].map((rating) => (
            <div key={rating} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < rating ? "fill-accent text-accent" : "fill-border text-border"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-muted group-hover:text-foreground">{rating} Stars & up</span>
              </div>
              <Checkbox.Root className="h-4 w-4 rounded-md border-2 border-border bg-white outline-none transition-all data-[state=checked]:border-primary data-[state=checked]:bg-primary">
                <Checkbox.Indicator>
                  <Check className="h-2.5 w-2.5 text-white stroke-[4]" />
                </Checkbox.Indicator>
              </Checkbox.Root>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Categories</h3>
          <button className="text-[10px] font-bold text-primary hover:underline">See All</button>
        </div>
        <div className="space-y-4">
          {['Grains & Tubers', 'Poultry', 'Livestock', 'Vegetables', 'Fruits'].map((cat) => (
            <div key={cat} className="flex items-center justify-between group cursor-pointer">
              <span className="text-xs font-bold text-muted group-hover:text-primary transition-colors">{cat}</span>
              <Checkbox.Root className="h-4 w-4 rounded-md border-2 border-border bg-white outline-none transition-all data-[state=checked]:border-primary data-[state=checked]:bg-primary">
                <Checkbox.Indicator>
                  <Check className="h-2.5 w-2.5 text-white stroke-[4]" />
                </Checkbox.Indicator>
              </Checkbox.Root>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Options */}
      <section>
        <h3 className="mb-4 text-sm font-bold text-foreground">Delivery Options</h3>
        <ToggleGroup.Root
          type="single"
          defaultValue="standard"
          className="inline-flex w-full items-center gap-1 rounded-xl bg-border/20 p-1"
        >
          <ToggleGroup.Item
            value="standard"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[10px] font-bold text-muted transition-all data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm"
          >
            <Truck className="h-3.5 w-3.5" />
            Standard
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value="pickup"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[10px] font-bold text-muted transition-all data-[state=on]:bg-white data-[state=on]:text-primary data-[state=on]:shadow-sm"
          >
            <MapPin className="h-3.5 w-3.5" />
            Pick Up
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </section>
    </aside>
  );
}
