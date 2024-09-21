module.exports = {
  $schema: "https://ui.shadcn.com/schema.json",
  style: "new-york",
  rsc: false,
  tsx: true,
  tailwind: {
    config: "tailwind.config.js",
    css: "src/index.css",
    baseColor: "zinc",
    cssVariables: true,
    prefix: "",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    ui: "src",
    lib: "@/lib",
    hooks: "@/hooks",
  },
};
