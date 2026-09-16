import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Node 26 exposes an optional global localStorage implementation that is
// unavailable unless the process receives --localstorage-file. That global can
// shadow JSDOM's storage and leave tests with `localStorage === undefined`.
if (typeof globalThis.localStorage === 'undefined') {
    class MemoryStorage implements Storage {
        private readonly values = new Map<string, string>();

        get length() {
            return this.values.size;
        }

        clear() {
            this.values.clear();
        }

        getItem(key: string) {
            return this.values.get(key) ?? null;
        }

        key(index: number) {
            return Array.from(this.values.keys())[index] ?? null;
        }

        removeItem(key: string) {
            this.values.delete(key);
        }

        setItem(key: string, value: string) {
            this.values.set(key, String(value));
        }
    }

    Object.defineProperty(globalThis, 'Storage', {
        configurable: true,
        value: MemoryStorage,
    });
    Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: new MemoryStorage(),
    });
}

afterEach(() => {
    cleanup();
});

// Mocks for JSDOM
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

window.scrollTo = vi.fn();

window.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock fetch to prevent "Invalid URL" errors from relative urls being called in tests
globalThis.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
    } as Response)
);

Element.prototype.scrollIntoView = vi.fn();
