import "@testing-library/jest-dom";

// Mock pour Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
}));

// Mock pour les imports CSS
jest.mock("*.css", () => ({}));
jest.mock("*.scss", () => ({}));

// Configuration globale pour les tests
beforeAll(() => {
  // Mock console.warn pour éviter les warnings d'Ant Design dans les tests
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Warning: [antd:")) {
      return;
    }
    originalWarn(...args);
  };
});

// Mock pour window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
