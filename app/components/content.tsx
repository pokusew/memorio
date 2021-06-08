"use strict";

import React from 'react';
import { Link } from '../router/compoments';
import {
	R_PACKAGE,
	R_PACKAGE_PRACTICE,
	R_PACKAGE_CATEGORY,
} from '../routes';
import { useFormatMessageId } from '../helpers/hooks';
import { isDefined } from '../helpers/common';
import LocalizedDate from './LocalizedDate';


export interface PackageCardProps {
	id: number;
	locale: string;
	name: string;
	description: string;
	numQuestions: number;
	numCategories: number;
	lastPractice: number | undefined;
	successRate: number | undefined;
}

export const PackageCard = (
	{
		id,
		locale,
		name,
		description,
		numQuestions,
		numCategories,
		lastPractice,
		successRate,
	}: PackageCardProps,
) => {

	const t = useFormatMessageId();

	return (
		<section className="card package" lang={locale}>

			<header className="card-heading">
				<h3 className="heading">{name}</h3>
				<p className="description">{description}</p>
			</header>

			<div className="card-content">
				<div className="package-details">
					{t('package.details', {
						numQuestions,
						numCategories,
						num: chunks => <strong className="number">{chunks}</strong>,
					})}
				</div>
				<div className="package-last-practice">
					<div className="package-last-practice">
						{!isDefined(lastPractice) ? t('package.noLastPractice') : (
							<>
								{t('package.lastPractice')}{' '}
								<LocalizedDate
									value={lastPractice}
								/>
							</>
						)}
					</div>
					{isDefined(successRate) && (
						<div className="progress">
							<div
								className="progress-bar bg-success"
								role="progressbar"
								style={{ width: `${successRate}%` }}
								aria-valuenow={successRate}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
							<div
								className="progress-bar bg-danger"
								role="progressbar"
								style={{ width: `${100 - successRate}%` }}
								aria-valuenow={100 - successRate}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
						</div>
					)}
				</div>
			</div>

			<div className="card-actions">
				<Link name={R_PACKAGE} payload={{ packageId: id }}>{t('package.actions.detail')}</Link>
				<Link name={R_PACKAGE_PRACTICE} payload={{ packageId: id }}>{t('package.actions.practice')}</Link>
				{/*<Link name={R_PACKAGE} payload={{ packageId: id }}>{t('package.actions.test')}</Link>*/}
			</div>

		</section>
	);

};

export interface PackageHeaderProps {
	id: number;
	locale: string;
	name: string;
	description: string;
	numQuestions: number;
	numCategories: number;
	lastPractice: number | undefined;
	successRate: number | undefined;
}

export const PackageHeader = (
	{
		id,
		locale,
		name,
		description,
		numQuestions,
		numCategories,
		lastPractice,
		successRate,
	}: PackageHeaderProps,
) => {

	const t = useFormatMessageId();

	return (
		<>
			<header lang={locale}>
				<h1>{name}</h1>
				<p>{description}</p>
			</header>

			<div className="package-content">
				<div className="package-details">
					{t('package.details', {
						numQuestions,
						numCategories,
						num: chunks => <strong className="number">{chunks}</strong>,
					})}
				</div>
				<div className="package-last-practice">
					<div className="package-last-practice">
						{!isDefined(lastPractice) ? t('package.noLastPractice') : (
							<>
								{t('package.lastPractice')}{' '}
								<LocalizedDate
									value={lastPractice}
								/>
							</>
						)}
					</div>
					{isDefined(successRate) && (
						<div className="progress">
							<div
								className="progress-bar bg-success"
								role="progressbar"
								style={{ width: `${successRate}%` }}
								aria-valuenow={successRate}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
							<div
								className="progress-bar bg-danger"
								role="progressbar"
								style={{ width: `${100 - successRate}%` }}
								aria-valuenow={100 - successRate}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
						</div>
					)}
				</div>
			</div>

			<div className="package-actions">
				<Link className="btn btn-lg btn-warning" name={R_PACKAGE_PRACTICE} payload={{ packageId: id }}>{t('package.actions.practice')}</Link>
				{/*<Link name={R_PACKAGE} payload={{ packageId: id }}>{t('package.actions.test')}</Link>*/}
			</div>

		</>
	);

};

export interface CategoryCardProps {
	packageId: number;
	id: number;
	locale: string;
	name: string;
	numQuestions: number;
	lastPractice: number | undefined;
	successRate: number | undefined;
}

export const CategoryCard = (
	{
		packageId,
		id,
		locale,
		name,
		numQuestions,
		lastPractice,
		successRate,
	}: CategoryCardProps,
) => {

	const t = useFormatMessageId();

	return (
		<section className="card category" lang={locale}>
			<header className="card-heading">
				<h3 className="heading">{name}</h3>
			</header>
			<div className="card-content">
				<div className="package-details">
					{t('category.details', {
						numQuestions,
						num: chunks => <strong className="number">{chunks}</strong>,
					})}
				</div>

				<div className="package-last-practice">
					<div className="package-last-practice">
						{!isDefined(lastPractice) ? t('package.noLastPractice') : (
							<>
								{t('package.lastPractice')}{' '}
								<LocalizedDate
									value={lastPractice}
								/>
							</>
						)}
					</div>
					{isDefined(successRate) && (
						<div className="progress">
							<div
								className="progress-bar bg-success"
								role="progressbar"
								style={{ width: `${successRate}%` }}
								aria-valuenow={successRate}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
							<div
								className="progress-bar bg-danger"
								role="progressbar"
								style={{ width: `${100 - successRate}%` }}
								aria-valuenow={100 - successRate}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
						</div>
					)}
				</div>

			</div>

			<div className="card-actions">
				<Link name={R_PACKAGE_CATEGORY} payload={{ packageId, categoryId: id }}>
					{t('category.actions.detail')}
				</Link>
			</div>

		</section>
	);

};

export interface CategoryHeaderProps {
	packageId: number;
	id: number;
	locale: string;
	name: string;
	numQuestions: number;
	lastPractice: number | undefined;
	successRate: number | undefined;
}

export const CategoryHeader = (
	{
		packageId,
		id,
		locale,
		name,
		numQuestions,
		lastPractice,
		successRate,
	}: CategoryHeaderProps,
) => {

	const t = useFormatMessageId();

	return (
		<>
			<header lang={locale}>
				<h1>{name}</h1>
			</header>

			<div className="package-content">
				<div className="package-details">
					{t('category.details', {
						numQuestions,
						num: chunks => <strong className="number">{chunks}</strong>,
					})}
				</div>
				<div className="package-last-practice">
					<div className="package-last-practice">
						{!isDefined(lastPractice) ? t('package.noLastPractice') : (
							<>
								{t('package.lastPractice')}{' '}
								<LocalizedDate
									value={lastPractice}
								/>
							</>
						)}
					</div>
					{isDefined(successRate) && (
						<div className="progress">
							<div
								className="progress-bar bg-success"
								role="progressbar"
								style={{ width: `${successRate}%` }}
								aria-valuenow={successRate}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
							<div
								className="progress-bar bg-danger"
								role="progressbar"
								style={{ width: `${100 - successRate}%` }}
								aria-valuenow={100 - successRate}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
						</div>
					)}
				</div>
			</div>

			<div className="package-actions">
				<Link className="btn btn-lg btn-warning" name={R_PACKAGE_PRACTICE} payload={{ packageId: id }}>{t('package.actions.practice')}</Link>
				{/*<Link name={R_PACKAGE} payload={{ packageId: id }}>{t('package.actions.test')}</Link>*/}
			</div>

		</>
	);

};

