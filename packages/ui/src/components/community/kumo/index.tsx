import { Badge as KumoBadge } from "@cloudflare/kumo/components/badge";
import { Breadcrumbs as KumoBreadcrumbs } from "@cloudflare/kumo/components/breadcrumbs";
import { Button as KumoButton } from "@cloudflare/kumo/components/button";
import { DropdownMenu as KumoDropdownMenu } from "@cloudflare/kumo/components/dropdown";
import { Input as KumoInput } from "@cloudflare/kumo/components/input";
import { LayerCard as KumoLayerCard } from "@cloudflare/kumo/components/layer-card";
import { Sidebar as KumoSidebar } from "@cloudflare/kumo/components/sidebar";
import type { ComponentProps } from "react";

type KumoBadgeProps = ComponentProps<typeof KumoBadge>;
type KumoBreadcrumbsProps = ComponentProps<typeof KumoBreadcrumbs>;
type KumoButtonProps = ComponentProps<typeof KumoButton>;
type KumoDropdownMenuProps = ComponentProps<typeof KumoDropdownMenu>;
type KumoInputProps = ComponentProps<typeof KumoInput>;
type KumoSidebarProps = ComponentProps<typeof KumoSidebar>;

export type {
  KumoBadgeProps,
  KumoBreadcrumbsProps,
  KumoButtonProps,
  KumoDropdownMenuProps,
  KumoInputProps,
  KumoSidebarProps,
};
export {
  KumoBadge,
  KumoBreadcrumbs,
  KumoButton,
  KumoDropdownMenu,
  KumoInput,
  KumoLayerCard,
  KumoSidebar,
};
