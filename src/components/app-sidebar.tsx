import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/Sidebar";
import { useEffect, useState } from "react";

interface SidebarProps {
  items: any[];
  setNodes: any;
  setConnections: any;
  setActions: any;
}

export function AppSidebar({
  items,
  setNodes,
  setConnections,
  setActions,
}: SidebarProps) {
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    if (items.length) {
      setShouldUpdate(true);
    }
  }, [items]);

  useEffect(() => {
    if (shouldUpdate) {
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);

  const handleMenuItemClick = (item: any) => {
    setNodes(item.Nodes);
    setConnections(item.Connections);
    setActions(item.Flow[0].steps);
  };

  return (
    <Sidebar className="w-[12vw]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item._id} id={item._id}>
                  <SidebarMenuButton asChild>
                    <a href="#" onClick={() => handleMenuItemClick(item)}>
                      <span>{item.Project}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
