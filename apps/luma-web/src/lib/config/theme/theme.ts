import { browser } from '$app/environment';

export type ThemeId = 'pastel' | 'pastel-dark';

export interface Theme {
	id: ThemeId;
	label: string;
	mode: 'light' | 'dark';
}

export class ThemeConfig {
	private static readonly STORAGE_KEY = 'luma:theme';
	private static readonly themes: Theme[] = [
		{ id: 'pastel', label: 'Pastel Light', mode: 'light' },
		{ id: 'pastel-dark', label: 'Pastel Dark', mode: 'dark' }
	];
	private static readonly themeById = new Map<ThemeId, Theme>(
		ThemeConfig.themes.map((theme) => [theme.id, theme])
	);

	private static prefersDark(): boolean {
		return browser && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	static getAvailableThemes(): Theme[] {
		return [...ThemeConfig.themes];
	}

	static getThemeById(id: ThemeId | null | undefined): Theme | undefined {
		return id ? ThemeConfig.themeById.get(id) : undefined;
	}

	static getStoredThemeId(): ThemeId | null {
		if (!browser) return null;
		const value = window.localStorage.getItem(ThemeConfig.STORAGE_KEY);
		return (value as ThemeId | null) ?? null;
	}

	static resolveInitialTheme(): Theme {
		const stored = ThemeConfig.getStoredThemeId();
		if (stored) {
			const theme = ThemeConfig.getThemeById(stored);
			if (theme) return theme;
		}
		return ThemeConfig.prefersDark()
			? ThemeConfig.themeById.get('pastel-dark')!
			: ThemeConfig.themeById.get('pastel')!;
	}

	static applyTheme(theme: Theme): void {
		if (!browser) return;
		document.documentElement.dataset.theme = theme.id;
		document.documentElement.classList.toggle('dark', theme.mode === 'dark');
		window.localStorage.setItem(ThemeConfig.STORAGE_KEY, theme.id);
	}

	static getNextThemeId(current: ThemeId): ThemeId {
		const index = ThemeConfig.themes.findIndex((theme) => theme.id === current);
		if (index === -1) return ThemeConfig.themes[0].id;
		const nextIndex = (index + 1) % ThemeConfig.themes.length;
		return ThemeConfig.themes[nextIndex].id;
	}
}