import type { Config } from "tailwindcss";
import sharedConfig from "@repo/config-tailwind";

const config: Pick<Config, "theme" | "presets"> = {
  presets: [sharedConfig],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
};

export default config;
