"use strict";

import React, { useEffect } from 'react';

import { IS_DEVELOPMENT, isDefined } from '../helpers/common';

import { INVALID_LINK } from './common';
import { useRouter } from './hooks';
import Router from './Router';

export type CommonLinkProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

export interface AppLinkProps extends CommonLinkProps {
	name: string;
	payload?: any;
}

export interface ExternalLinkProps extends CommonLinkProps {
	url: string;
}

export type LinkProps = AppLinkProps | ExternalLinkProps;

export const isAppLinkProps = (props: AppLinkProps | ExternalLinkProps): props is AppLinkProps => isDefined((props as AppLinkProps).name);

export const createHref = (router: Router, props: LinkProps): string => {

	const href = isAppLinkProps(props)
		? router.convertRouteToUrl(props.name, props.payload)
		: props.url;

	if (typeof href !== 'string') {
		IS_DEVELOPMENT && console.error(`[createHref] cannot create href`, props);
		return INVALID_LINK;
	}

	return href;

};

export const Link = ({ className, children, ...props }: LinkProps) => {

	const router = useRouter();

	const href = createHref(router, props);

	return (
		<a
			className={className}
			href={href}
			onClick={router.defaultLinkOnClickHandler}
		>{children}</a>
	);

};

export type NavLinkProps = LinkProps & {
	activeClassName?: string;
}

export const NavLink = ({ className, children, ...props }: NavLinkProps) => {

	const router = useRouter();

	const href = createHref(router, props);

	return (
		<a
			className={className}
			href={href}
			onClick={router.defaultLinkOnClickHandler}
		>{children}</a>
	);

};

export const Redirect = (props: LinkProps) => {

	const router = useRouter();

	const href = createHref(router, props);

	useEffect(() => {

		console.log(`[Redirect] redirecting to ${href}`);

		router.redirectUsingUrl(href);

	}, [router, href]);

	return null;

};
