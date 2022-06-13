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
		signIn: `Přihlásit se`,
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
		selectAll: `Vybrat vše`,
		selectNone: `Zrušit výběr`,
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
			multipleChoice: `více správných odpovědí (min. jedna, max. všechny)`,
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
	practiceSetupForm: {
		labels: {
			mode: `Způsob řazení`,
			category: `Kategorie`,
		},
		values: {
			mode: {
				progress: `Podle pokroku (otázky s nejmenší úspěšností jako první)`,
				random: `Náhodně (otázky seřazeny v náhodném pořadí)`,
				order: `Podle pořadí (otázky seřazeny dle jejich čísla)`,
			},
		},
		errors: {
			atLeastOneCategory: `Vyberte prosím alespoň jednu kategorii.`,
		},
		submit: `Začít`,
	},
	questionsList: {
		srHints: {
			correct: 'Tato možnost je správně.',
			wrong: 'Tato možnost je špatně.',
		},
		edit: `Upravit`,
	},
	homePage: {
		callout: {
			welcome: `Vítejte v aplikaci Memorio, která slouží pro procvičování otázek.`,
			gettingStarted: `Začněte výběrem balíčku otázek.`,
			// gettingStarted: `Začněte výběrem balíčku otázek. Po prvním otevření se automaticky uloží pro použití offline.`,
		},
		packagesHeading: `Přehled balíčků`,
	},
	packagePage: {
		categoriesHeading: `Kategorie`,
	},
	categoryPage: {
		questionsHeading: `Otázky`,
	},
	questionPage: {
		heading: `Editace otázky`,
		preview: `Náhled`,
		prevQuestion: `Přechozí otázka`,
		nextQuestion: `Následující otázka`,
	},
	practicePage: {
		tipsHeading: `Ovládání a další tipy`,
		tips: `
			<li>Procvičování je možné kdykoliv ukončit.</li>
			<li>Výsledky se automaticky průběžně započítávají do celkového skóre.</li>
			<li>Po zodpovězení každé otázky ihned uvidíte výsledek a správné řešení.</li>
			<li>K ovládání je možné používat také klávesnici
				– <kbd>Enter</kbd> pro potvrzení odpovědi a přechod na další otázku
				– čísla/písmena pro výběr možností.
			</li>
			<li>Zvukové efetky je možné zapnout/vypout v <settings>Nastavení</settings>.</li>
		`,
		finishedHeading: `Procvičování dokončeno`,
		finished: `Všechny vybrané otázky byly procvičeny.`,
		backToPackage: `Zpět na stránku balíčku`,
	},
	loginPage: {
		errors: {
			invalid_credentials: `Neplatné přihlašovací údaje.`,
			unknown: `Při přihlašování došlo k nézmámé chybě: {message}`,
		},
		title: `Přihlášení`,
	},
	settingsPage: {
		dataManagementHeading: `Správa dat`,
		deleteScores: `Vynulovat všechna skóré`,
		deleteScoresConfirmation: `Opravdu si přejete vynulovat všechna skóré?`,
		deleteAllLocalData: `Smazat všechny stažené balíčky a všechna skóré`,
		deleteAllLocalDataConfirmation:
			`Opravdu si přejete smazat všechny stažené balíčky pro offline použití? Tím se také vymažou všechna skóré.`,
	},
	notFoundPage: {
		backToHomePageBtn: `Zpět na úvodní stránku`,
		message: `Této adrese neodpovídá žádná stránka.`,
	},
};
