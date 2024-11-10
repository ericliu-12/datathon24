"use client";

import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";

// const actions = [
//   { action: "User sends request to load balancer", node: "1" },
//   {
//     action: "Load balancer directs request to application server",
//     node: "2",
//   },
//   {
//     action: "Application server retrieves data from database",
//     node: "3",
//   },
//   {
//     action: "Application server requests video content from CDN",
//     node: "3",
//   },
//   {
//     action: "CDN delivers video content to user",
//     node: "5",
//   },
// ];

export default function VerticalCarousel({ onActionHover, actions }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Update hovered node whenever active item changes
  useEffect(() => {
    onActionHover(actions[activeIndex].node);
  }, [activeIndex, onActionHover]);

  const handleNext = () => {
    console.log(actions);
    setActiveIndex((prevIndex) => (prevIndex + 1) % actions.length);
  };

  const handlePrevious = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? actions.length - 1 : prevIndex - 1
    );
  };

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full max-w-xs mr-4"
    >
      <CarouselContent className="-mt-1 h-[155px]">
        {actions.map((item, index) => (
          <CarouselItem key={index} className="p-0">
            <div className="p-1 flex justify-center">
              <Card className="w-[150px] h-[150px]">
                {" "}
                {/* Square dimensions */}
                <CardContent className="flex items-center justify-center h-full p-4">
                  <span className="text-s text-gray-500 text-center">
                    {item.action}
                  </span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div onClick={handlePrevious}>
        <CarouselPrevious />
      </div>
      <div onClick={handleNext}>
        <CarouselNext />
      </div>
    </Carousel>
  );
}
