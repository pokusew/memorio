"use strict";

export default {
	locales: {
		auto: `automaticky dle jazyka prohlížeče`,
		en: `angličtina`,
		cs: 'čeština',
	},
	titles: {
		home: `Přehled balíčků`,
		loading: `Načítání ...`,
		login: `Přihlášení`,
		notFound: `Stránka nenalezena`,
		settings: `Nastavení`,
		users: `Uživatelé`,
		practice: `Procvičování`,
	},
	header: {
		appName: `Memorio`,
	},
	footer: {
		sourceCode: `Zdrojový kód na`,
	},
	package: {
		// X otázka/otázky/otázek v/ve Y kategorii/kateogriích
		details: `
			<num>{numQuestions, number}</num> {numQuestions, plural,
				one {otázka}
				few {otázky}
				other {otázek}
			} {numCategories, plural,
				few {ve}
				other {v}
			} <num>{numCategories, number}</num> {numCategories, plural,
				one {kategorii}
				other {kategoriích}
			}
		`,
		noLastPractice: 'zatím neprocvičováno',
		lastPractice: 'naposledy procvičováno v',
		actions: {
			detail: 'Detail balíčku',
			practice: 'Procvičovat',
			test: 'Test',
		},
	},
	category: {
		// X otázka/otázky/otázek
		details: `
			<num>{numQuestions, number}</num> {numQuestions, plural,
				one {otázka}
				few {otázky}
				other {otázek}
			}
		`,
		actions: {
			detail: 'Detail kategorie',
		},
	},
	ui: {
		add: `Přidat`,
		pageHeader: {
			toggle: `Otevřít/Zavřít menu`,
		},
		loading: 'Načítání ...',
		loadingError: 'Došlo k chybě při načítání dat.',
	},
	forms: {
		cancel: `Zrušit`,
		errors: {
			fieldRequired: `Vyplňte toto pole.`,
		},
		prompt: `-- Prosím vyberte --`,
		send: `Odeslat`,
	},
	loginForm: {
		labels: {
			email: `E-mail`,
			password: `Heslo`,
		},
		loading: `Přihlašování...`,
		login: `Přihlásit se`,
	},
	settingsForm: {
		labels: {
			effectiveLocale: `Aktuálně použitý jazyk`,
			locale: `Jazyk`,
			soundEffects: `Zvukové efekty`,
			serverUrl: `URL serveru`,
		},
		switchToBtn: `Přepnout na {url}`,
	},
	questionForm: {
		types: {
			singleChoice: `právě jedna správná odpověď`,
			multipleChoice: `více správných odpovědí`,
		},
		validation: {
			correct: `Otázka byla zodpovězna <strong>správně</strong>.`,
			wrong: `Otázka byla zodpovězna <strong>špatně</strong>.`,
		},
		actions: {
			validate: `Zkontrolovat`,
			next: `Další otázka`,
		},
	},
	homePage: {
		callout: {
			welcome: `Vítejte v aplikaci Memorio, která slouží pro procvičování otázek.`,
			gettingStarted: `Začněte výběrem balíčku otázek. Můžete si ho také uložit pro použití offline.`,
		},
		packagesHeading: `Přehled balíčků`,
	},
	packagePage: {
		categoriesHeading: `Kategorie`,
	},
	categoryPage: {
		questionsHeading: `Otázky`,
	},
	loginPage: {
		errors: {
			invalid_credentials: `Neplatné přihlašovací údaje.`,
			unknown: `Při přihlašování došlo k nézmámé chybě: {message}`,
		},
		title: `Přihlášení`,
	},
	notFoundPage: {
		backToHomePageBtn: `Zpět na úvodní stránku`,
		message: `Této adrese neodpovídá žádná stránka.`,
	},
};
