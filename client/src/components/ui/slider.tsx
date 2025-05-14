import { KeenSliderOptions, useKeenSlider } from "keen-slider/react";
import { ReactElement } from "react";

const Slider = <T extends ReactElement>({
  slides,
  delay = 5000,
  options,
}: {
  slides: T[];
  delay?: number;
  options?: KeenSliderOptions<unknown, unknown, string>;
}) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      ...options,
      loop: true,
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, delay);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );
  return (
    <div ref={sliderRef} className="keen-slider">
      {slides.map((element, i) => (
        <div
          className={`keen-slider__slide number-slide${i + 1} px-2`}
          key={element.key}
        >
          {element}
        </div>
      ))}
    </div>
  );
};

export default Slider;
