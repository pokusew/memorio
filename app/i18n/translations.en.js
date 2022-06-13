"use strict";

export default {
	locales: {
		auto: `automatically (according to the browser language)`,
		en: `English`,
		cs: 'Czech',
	},
	titles: {
		home: `Packages overview`,
		loading: `Loading ...`,
		login: `Login`,
		notFound: `Page not found`,
		settings: `Settings`,
		users: `Users`,
		practice: `Practice`,
	},
	header: {
		appName: `Memorio`,
		signIn: `Sign in`,
	},
	footer: {
		sourceCode: `Source code on`,
	},
	package: {
		// X question/questions in Y category/categories
		details: `
			<num>{numQuestions, number}</num> {numQuestions, plural,
				one {question}
				other {questions}
			} in <num>{numCategories, number}</num> {numCategories, plural,
				one {category}
				other {categories}
			}
		`,
		noLastPractice: 'not yet practiced',
		lastPractice: 'last practice on',
		actions: {
			detail: 'Package detail',
			practice: 'Practice',
			test: 'Test',
		},
	},
	category: {
		// X question/questions
		details: `
			<num>{numQuestions, number}</num> {numQuestions, plural,
				one {question}
				other {questions}
			}
		`,
		actions: {
			detail: 'Category detail',
		},
	},
	ui: {
		add: `Add`,
		pageHeader: {
			toggle: `Open/Close menu`,
		},
		loading: 'Loading ...',
		loadingError: 'An error occurred while loading data.',
	},
	forms: {
		selectAll: `Select all`,
		selectNone: `Select none`,
		cancel: `Cancel`,
		errors: {
			fieldRequired: `Please fill this field.`,
		},
		prompt: `-- Please select --`,
		send: `Submit`,
	},
	loginForm: {
		labels: {
			email: `E-mail`,
			password: `Password`,
		},
		loading: `Logging in...`,
		login: `Login`,
	},
	settingsForm: {
		labels: {
			effectiveLocale: `Currently used language`,
			locale: `Language`,
			soundEffects: `Sound effects`,
			serverUrl: `Server URL`,
		},
		switchToBtn: `Switch to {url}`,
	},
	questionPracticeForm: {
		types: {
			singleChoice: `exactly one correct answer`,
			multipleChoice: `more correct answers possible (min. one, max. all)`,
		},
		validation: {
			correct: `The question was answered <strong>correctly</strong>.`,
			wrong: `The question was answered <strong>incorrectly</strong>.`,
		},
		actions: {
			validate: `Check answer`,
			next: `Next question`,
		},
	},
	practiceSetupForm: {
		labels: {
			mode: `Order of questions`,
			category: `Categories`,
		},
		values: {
			mode: {
				progress: `By progress (questions with the lowest success rate first)`,
				random: `Random (questions sorted in random order)`,
				order: `Natural order (questions sorted by their number)`,
			},
		},
		errors: {
			atLeastOneCategory: `Please select at least one category.`,
		},
		submit: `Start`,
	},
	questionsList: {
		srHints: {
			correct: 'This option is correct.',
			wrong: 'This option is wrong.',
		},
		edit: `Edit`,
	},
	homePage: {
		callout: {
			welcome: `Welcome to Memorio – an app for for practicing test questions.`,
			gettingStarted: `Start by selecting a package of questions.`,
			// gettingStarted: `Start by selecting a package of questions. When first opened, it is automatically saved for offline use.`,
		},
		packagesHeading: `Packages overview`,
	},
	packagePage: {
		categoriesHeading: `Categories`,
	},
	categoryPage: {
		questionsHeading: `Questions`,
	},
	questionPage: {
		heading: `Question editor`,
		preview: `Preview`,
		prevQuestion: `Prev question`,
		nextQuestion: `Next question`,
	},
	practicePage: {
		tipsHeading: `Control and tips`,
		tips: `
			<li>It is possible to end the practice at any time.</li>
			<li>The results are automatically continuously counted towards the total score.</li>
			<li>After answering each question, you will immediately see the result and the correct solution.</li>
			<li>You can also use the keyboard
				– <kbd>Enter</kbd> to check the answer and move on to the next question
				– numbers/letters to select choices.
			</li>
			<li>Sound effects can be enabled/disabled in the <settings>Settings</settings>.</li>
		`,
		finishedHeading: `Practice completed`,
		finished: `All selected questions were practiced.`,
		backToPackage: `Return to the package detail`,
	},
	loginPage: {
		errors: {
			invalid_credentials: `Invalid login credentials.`,
			unknown: `An unknown error occurred while logging in: {message}`,
		},
		title: `Login`,
	},
	settingsPage: {
		dataManagementHeading: `Data management`,
		deleteScores: `Reset all scores`,
		deleteScoresConfirmation: `Are you sure you want to reset all scores?`,
		deleteAllLocalData: `Delete all downloaded packages and reset all scores`,
		deleteAllLocalDataConfirmation:
			`Are you sure you want to delete all downloaded packages for offline use? This will also reset all scores.`,
	},
	notFoundPage: {
		backToHomePageBtn: `Return to the home page`,
		message: `There is no page on this address.`,
	},
};
