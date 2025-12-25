import { describe, expect, it, beforeEach, vi, type Mock } from 'vitest';
import { ThemeConfig } from './theme';

describe('theme manager (browser)', () => {
	beforeEach(() => {
		vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })) as unknown as typeof matchMedia);
		window.localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
		document.documentElement.classList.remove('dark');
	});

	it('returns available themes', () => {
		expect(ThemeConfig.getAvailableThemes().map((t) => t.id)).toEqual(['pastel', 'pastel-dark']);
	});

	it('reads stored theme id', () => {
		window.localStorage.setItem('luma:theme', 'pastel-dark');
		expect(ThemeConfig.getStoredThemeId()).toBe('pastel-dark');
	});

	it('resolves initial theme from storage', () => {
		window.localStorage.setItem('luma:theme', 'pastel-dark');
		expect(ThemeConfig.resolveInitialTheme().id).toBe('pastel-dark');
	});

	it('falls back to system preference', () => {
		(window.matchMedia as unknown as Mock).mockReturnValue({ matches: true });
		window.localStorage.clear();
		expect(ThemeConfig.resolveInitialTheme().id).toBe('pastel-dark');
	});

	it('applies theme to document', () => {
		const theme = ThemeConfig.getThemeById('pastel-dark');
		ThemeConfig.applyTheme(theme!);
		expect(document.documentElement.dataset.theme).toBe('pastel-dark');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
		expect(window.localStorage.getItem('luma:theme')).toBe('pastel-dark');
	});

	it('cycles theme ids', () => {
		expect(ThemeConfig.getNextThemeId('pastel')).toBe('pastel-dark');
		expect(ThemeConfig.getNextThemeId('pastel-dark')).toBe('pastel');
		// unknown id defaults to first
		expect(ThemeConfig.getNextThemeId('unknown' as never)).toBe('pastel');
	});
});
