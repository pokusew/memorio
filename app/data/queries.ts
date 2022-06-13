"use strict";

import { LocalCategory, LocalFullPackage, LocalPackage, LocalQuestion } from '../types';
import {
	collection,
	doc,
	Firestore,
	getDoc,
	getDocs,
	increment,
	QuerySnapshot,
	setDoc,
	Timestamp,
	writeBatch,
} from 'firebase/firestore';
import { AppUser } from '../firebase/types';
import { IS_DEVELOPMENT, isDefined } from '../helpers/common';


const DEFAULT_DELAY = 1000;

const delay = (ms: number = DEFAULT_DELAY) => new Promise<void>((resolve => {
	setTimeout(() => {
		resolve(undefined);
	}, ms);
}));

const userPracticeDataFromFirebase = (data) => {
	return {
		lastPractice: data.lastPractice instanceof Timestamp ? data.lastPractice.toDate() : undefined,
		score: data.score,
	};
};

export interface WithOptionalNumber {
	number?: number | undefined;
}

export const byNumberAscending = (a: WithOptionalNumber, b: WithOptionalNumber): number =>
	(a.number ?? 0) - (b.number ?? 0);

export const packages = {
	findAll: () => async (db: Firestore, user: AppUser | null): Promise<LocalPackage[]> => {

		IS_DEVELOPMENT && console.log(`[queries] user=${user?.uid ?? '(none)'} packages.findAll()`);

		const queries: Promise<QuerySnapshot>[] = [];

		queries.push(getDocs(collection(db, 'packages')));

		if (isDefined(user)) {
			queries.push(getDocs(collection(db, 'users', user.uid, 'versions', user.data.practiceDataVersion.toString(), 'packages')));
		}

		const [packagesS, packagesUserDataS] = await Promise.all(queries);

		const packages: LocalPackage[] = [];
		const packagesMap: Map<string, LocalPackage> = new Map();

		packagesS.forEach((doc) => {
			const pack: LocalPackage = {
				id: doc.id,
				...doc.data(),
				userPracticeData: {},
			} as LocalPackage;
			packages.push(pack);
			packagesMap.set(pack.id, pack);
		});

		if (isDefined(packagesUserDataS)) {
			packagesUserDataS.forEach((doc) => {
				const pack = packagesMap.get(doc.id);
				if (isDefined(pack)) {
					pack.userPracticeData = userPracticeDataFromFirebase(doc.data());
				}
			});
		}

		return packages;

	},
	findOneById: (id: string) => async (db: Firestore, user: AppUser | null): Promise<LocalFullPackage | undefined> => {

		IS_DEVELOPMENT && console.log(`[queries] user=${user?.uid ?? '(none)'} packages.findOneById(id='${id}')`);

		const queries: Promise<any>[] = [];

		queries.push(getDoc(doc(db, 'packages', id)));
		// TODO: order categories and questions by number directly using Firestore
		//       once we ensure that all documents have the number field
		//       see https://firebase.google.com/docs/firestore/query-data/order-limit-data
		queries.push(getDocs(collection(db, 'packages', id, 'categories')));
		queries.push(getDocs(collection(db, 'packages', id, 'questions')));

		if (isDefined(user)) {
			queries.push(getDoc(doc(db, 'users', user.uid, 'versions', user.data.practiceDataVersion.toString(), 'packages', id)));
			queries.push(getDocs(collection(db, 'users', user.uid, 'versions', user.data.practiceDataVersion.toString(), 'packages', id, 'categories')));
			queries.push(getDocs(collection(db, 'users', user.uid, 'versions', user.data.practiceDataVersion.toString(), 'packages', id, 'questions')));
		}

		const [
			packageS, categoriesS, questionsS,
			packageUserDataS, packageCategoriesUserDataS, packageQuestionsUserDataS,
		] = await Promise.all(queries);

		if (!packageS.exists()) {
			return undefined;
		}

		const pack: LocalFullPackage = {
			id: packageS.id,
			...packageS.data(),
			userPracticeData: {},
			categories: [],
			questions: [],
		} as LocalFullPackage;

		const categoriesMap: Map<string, LocalCategory> = new Map();
		const questionsMap: Map<string, LocalQuestion> = new Map();

		categoriesS.forEach((doc) => {
			const category: LocalCategory = {
				id: doc.id,
				package: pack.id,
				...doc.data(),
				userPracticeData: {},
			} as LocalCategory;
			pack.categories.push(category);
			categoriesMap.set(category.id, category);
		});

		questionsS.forEach((doc) => {
			const question: LocalQuestion = {
				id: doc.id,
				package: pack.id,
				...doc.data(),
				userPracticeData: {},
			} as LocalQuestion;
			pack.questions.push(question);
			questionsMap.set(question.id, question);
		});

		if (isDefined(packageUserDataS) && packageUserDataS.exists()) {
			pack.userPracticeData = userPracticeDataFromFirebase(packageUserDataS.data());
		}

		if (isDefined(packageCategoriesUserDataS)) {
			packageCategoriesUserDataS.forEach((doc) => {
				const category = categoriesMap.get(doc.id);
				if (isDefined(category)) {
					category.userPracticeData = userPracticeDataFromFirebase(doc.data());
				}
			});
		}

		if (isDefined(packageQuestionsUserDataS)) {
			packageQuestionsUserDataS.forEach((doc) => {
				const question = questionsMap.get(doc.id);
				if (isDefined(question)) {
					question.userPracticeData = userPracticeDataFromFirebase(doc.data());
				}
			});
		}

		// in-place sort
		pack.categories.sort(byNumberAscending);
		pack.questions.sort(byNumberAscending);

		// IS_DEVELOPMENT && console.log(
		// 	`[queries] user=${user?.uid ?? '(none)'} packages.findOneById(id='${id}') pack =`, pack,
		// );

		return pack;

	},
};

export const incrementScore = async (
	db: Firestore,
	user: AppUser,
	version: number,
	packageId: string,
	categoryId: string,
	questionId: string,
	lastPractice: Date,
	correctInc: number,
	wrongInc: number,
): Promise<void> => {

	const data = {
		lastPractice,
		score: {
			correct: increment(correctInc),
			wrong: increment(wrongInc),
		},
	};

	const packageUserDataRef = doc(
		db, 'users', user.uid, 'versions', version.toString(), 'packages', packageId,
	);
	const packageCategoryUserDataRef = doc(
		db, 'users', user.uid, 'versions', version.toString(), 'packages', packageId, 'categories', categoryId,
	);
	// Note:
	//   The doc at `users/{userId}/versions/{version}/packages/{packageId}/questions/{questionId}`
	//   should contain the same data as the doc at
	//   `users/{userId}/versions/{version}/packages/{packageId}/categories/{categoryId}/questions/{questionId}`.
	//   It is duplicate because of limitations of queries.
	const packageQuestionUserDataRef = doc(
		db, 'users', user.uid, 'versions', version.toString(), 'packages', packageId, 'questions', questionId,
	);
	const packageCategoryQuestionUserDataRef = doc(
		db, 'users', user.uid, 'versions', version.toString(), 'packages', packageId, 'categories', categoryId, 'questions', questionId,
	);

	const batch = writeBatch(db);

	batch.set(packageUserDataRef, data, { merge: true });
	batch.set(packageCategoryUserDataRef, data, { merge: true });
	batch.set(packageQuestionUserDataRef, data, { merge: true });
	batch.set(packageCategoryQuestionUserDataRef, data, { merge: true });

	await batch.commit();

};

export const updateScore = async (
	db: Firestore,
	user: AppUser,
	version: number,
	packageId: string,
	categoryId: string,
	questionId: string,
	lastPractice: Date,
	correct: boolean,
): Promise<void> =>
	incrementScore(
		db,
		user,
		version,
		packageId,
		categoryId,
		questionId,
		lastPractice,
		correct ? 1 : 0,
		!correct ? 1 : 0,
	);

export const deleteAllScores = async (
	db: Firestore,
	user: AppUser,
): Promise<void> => {

	const userDataRef = doc(db, 'users', user.uid);

	await setDoc(userDataRef, { practiceDataVersion: increment(1) }, { merge: true });

	// TODO: listen for practiceDataVersion change (on server / using Firebase Functions) and remove the old data

};
