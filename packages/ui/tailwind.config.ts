import type { Config } from "tailwindcss";
import sharedConfig from "@repo/config-tailwind";

const config: Pick<Config, "presets" | "content"> = {
  content: ["./src/**/*.tsx"],
  presets: [sharedConfig],
};

export default config;
