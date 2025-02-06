const links: {
  elementType: "link" | "meta";
  rel?: string;
  type?: string;
  href?: string;
  sizes?: string;
  media?: string;
  name?: string;
  content?: string;
}[] = [
  {
    elementType: "link",
    rel: "icon",
    type: "image/png",
    href: "/icon/light/favicon-96x96.png",
    sizes: "96x96",
    media: "(prefers-color-scheme: light)",
  },
  {
    elementType: "link",
    rel: "icon",
    type: "image/png",
    href: "/icon/dark/favicon-96x96.png",
    sizes: "96x96",
    media: "(prefers-color-scheme: dark)",
  },
  {
    elementType: "link",
    rel: "icon",
    type: "image/svg+xml",
    href: "/icon/light/favicon.svg",
    media: "(prefers-color-scheme: light)",
  },
  {
    elementType: "link",
    rel: "icon",
    type: "image/svg+xml",
    href: "/icon/dark/favicon.svg",
    media: "(prefers-color-scheme: dark)",
  },
  {
    elementType: "link",
    rel: "shortcut icon",
    href: "/icon/light/favicon.ico",
    media: "(prefers-color-scheme: light)",
  },
  {
    elementType: "link",
    rel: "shortcut icon",
    href: "/icon/dark/favicon.ico",
    media: "(prefers-color-scheme: dark)",
  },
  {
    elementType: "link",
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/icon/apple-touch-icon.png",
  },
  {
    elementType: "meta",
    name: "apple-mobile-web-app-title",
    content: "Batbox",
  },
  { elementType: "link", rel: "manifest", href: "/icon/site.webmanifest" },
];

const head: HTMLHeadElement | null =
  document.head || document.getElementsByTagName("head")[0] || null;

if (head) {
  links.forEach((attributes) => {
    const element: HTMLLinkElement | HTMLMetaElement = document.createElement(
      attributes.elementType,
    );

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    head.appendChild(element);
  });
}
