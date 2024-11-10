"use client";

import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";

const actions = [
  { action: "User sends request to load balancer", node: "User (1)" },
  {
    action: "Load balancer directs request to application server",
    node: "Load Balancer (2)",
  },
  {
    action: "Application server retrieves data from database",
    node: "Application Server (3)",
  },
  {
    action: "Application server requests video content from CDN",
    node: "Application Server (3)",
  },
  {
    action: "CDN delivers video content to user",
    node: "Content Delivery Network (5)",
  },
];

export default function VerticalCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-full max-w-xs"
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
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
