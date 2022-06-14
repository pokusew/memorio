"use strict";

import React from 'react';
import { Link } from '../router/compoments';
import { R_PACKAGE_QUESTION } from '../routes';
import { Question, QuestionData } from '../types';
import classNames from 'classnames';
import { useFormatMessageId } from '../helpers/hooks';
import { processTextToHtml } from '../text/format';


export interface QuestionsListWithoutEditButtonItemProps {
	question: QuestionData;
	showEditButton: false;
}

export interface QuestionsListWithEditButtonItemProps {
	question: Question;
	showEditButton: true;
}

export type QuestionsItemProps = QuestionsListWithoutEditButtonItemProps | QuestionsListWithEditButtonItemProps;

export const QuestionsListItem = (props: QuestionsItemProps) => {

	const t = useFormatMessageId();

	const { number, text, correct, choices } = props.question;

	const correctSet = new Set<number>(correct);

	return (
		<li className="question" value={number}>

			<div className="question-content">

				<div className="question-text remark-text" dangerouslySetInnerHTML={{ __html: processTextToHtml(text) }} />

				<ol className="question-choices">
					{choices.map(choice => {

						const isCorrect = correctSet.has(choice.id);

						return (
							<li
								key={choice.id}
								value={choice.id}
								className={classNames('question-choice', {
									'question-choice--correct': isCorrect,
								})}
							>
								<div
									className="question-choice-text remark-text"
									dangerouslySetInnerHTML={{ __html: processTextToHtml(choice.text) }}
								/>
								<span className="sr-only">
								{' '}{t(`questionsList.srHints.${isCorrect ? 'correct' : 'wrong'}`)}
							</span>
							</li>
						);

					})}
				</ol>

				{props.showEditButton && (
					<Link
						className="question-edit-btn"
						name={R_PACKAGE_QUESTION}
						payload={{
							packageId: props.question.package,
							questionId: props.question.id,
						}}
					>
						{t(`questionsList.edit`)}
					</Link>
				)}

			</div>

		</li>
	);

};
