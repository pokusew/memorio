"use strict";

import React from 'react';
import { Link } from '../router/compoments';
import { R_PACKAGE, R_PACKAGE_CATEGORY, R_PACKAGE_PRACTICE, R_PACKAGE_QUESTION, R_ROOT, R_SETTINGS } from '../routes';
import { useFormatMessageId } from '../helpers/hooks';


export type BreadcrumbsProps =
	| { name: typeof R_ROOT }
	| { name: typeof R_SETTINGS }
	| { name: typeof R_PACKAGE; packageId: string; packageName: string }
	| { name: typeof R_PACKAGE_CATEGORY; packageId: string; packageName: string; categoryId: string; categoryName: string; }
	| { name: typeof R_PACKAGE_QUESTION; packageId: string; packageName: string; questionId: string; questionName: string; }
	| { name: typeof R_PACKAGE_PRACTICE; packageId: string; packageName: string }

export type BreadcrumbsLink = {
	name: string;
	payload?: any;
	label: string;
}

export const breadcrumbsPropsToLinks = (t: ReturnType<typeof useFormatMessageId>, props: BreadcrumbsProps): BreadcrumbsLink[] => {

	const links: BreadcrumbsLink[] = [
		{
			name: R_ROOT,
			label: t(`titles.home`) as string,
		},
	];

	if (props.name === R_ROOT) {
		return links;
	}

	if (props.name === R_SETTINGS) {
		links.push({
			name: R_SETTINGS,
			label: t(`titles.settings`) as string,
		});
		return links;
	}

	if (props.name === R_PACKAGE || props.name === R_PACKAGE_CATEGORY || props.name === R_PACKAGE_QUESTION || props.name === R_PACKAGE_PRACTICE) {

		links.push({
			name: R_PACKAGE,
			payload: {
				packageId: props.packageId,
			},
			label: props.packageName,
		});

		if (props.name === R_PACKAGE) {
			return links;
		}

		if (props.name === R_PACKAGE_CATEGORY) {
			links.push({
				name: R_PACKAGE_CATEGORY,
				payload: {
					packageId: props.packageId,
					categoryId: props.categoryId,
				},
				label: props.categoryName,
			});
			return links;
		}

		if (props.name === R_PACKAGE_QUESTION) {
			links.push({
				name: R_PACKAGE_QUESTION,
				payload: {
					packageId: props.packageId,
					questionId: props.questionId,
				},
				label: props.questionName,
			});
			return links;
		}

		if (props.name === R_PACKAGE_PRACTICE) {
			links.push({
				name: R_PACKAGE_PRACTICE,
				payload: {
					packageId: props.packageId,
				},
				label: t(`titles.practice`) as string,
			});
			return links;
		}

		return links;

	}

	return links;

};

export const Breadcrumbs = React.memo((props: BreadcrumbsProps) => {

	const t = useFormatMessageId();

	const links = breadcrumbsPropsToLinks(t, props);

	return (
		<nav className="breadcrumbs">
			<ol>
				{links.map(({ name, payload, label }) => (
					<li key={name}><Link name={name} payload={payload}>{label}</Link></li>
				))}
			</ol>
		</nav>
	);

});
