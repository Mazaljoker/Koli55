import React from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import cn from "classnames";

interface SliderProps extends RadixSlider.SliderProps {
  label?: string;
  // On pourrait ajouter des props pour afficher la valeur actuelle, etc.
}

export const Slider: React.FC<SliderProps> = ({
  label,
  className,
  defaultValue = [50],
  max = 100,
  step = 1,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-allokoli-text-secondary mb-2">
          {label}
        </label>
      )}
      <RadixSlider.Root
        className={cn(
          "relative flex items-center select-none touch-none w-full h-5 cursor-pointer",
          className
        )}
        defaultValue={defaultValue}
        max={max}
        step={step}
        {...props}
      >
        <RadixSlider.Track className="bg-allokoli-surface relative grow rounded-full h-[6px]">
          <RadixSlider.Range className="absolute bg-allokoli-primary rounded-full h-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-allokoli-primary focus:ring-offset-2 focus:ring-offset-allokoli-background transition-colors"
          aria-label={label || "Volume"}
        />
      </RadixSlider.Root>
    </div>
  );
};

Slider.displayName = "Slider";
