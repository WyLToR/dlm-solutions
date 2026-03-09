import type BaseBadge from "./components/ui/BaseBadge.vue";
import type BaseButton from "./components/ui/BaseButton.vue";
import type BaseCard from "./components/ui/BaseCard.vue";
import type BaseDialog from "./components/ui/BaseDialog.vue";
import type BaseSpinner from "./components/ui/BaseSpinner.vue";

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    BaseBadge: typeof BaseBadge;
    BaseButton: typeof BaseButton;
    BaseCard: typeof BaseCard;
    BaseDialog: typeof BaseDialog;
    BaseSpinner: typeof BaseSpinner;
  }
}

export {};
