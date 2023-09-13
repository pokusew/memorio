"use strict";

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import 'katex/contrib/mhchem';
import rehypeStringify from 'rehype-stringify';


export const processTextToHtml = (input: string): string => {

	// TODO: remove ts-ignore comments once all unified libs are ready
	//       see https://github.com/unifiedjs/unified/issues/228
	//       see https://github.com/unifiedjs/unified/issues/227
	const file = unified()
		// @ts-ignore
		.use(remarkParse)
		// @ts-ignore
		.use(remarkMath)
		// @ts-ignore
		.use(remarkRehype)
		// @ts-ignore
		.use(rehypeKatex)
		.use(rehypeStringify)
		.processSync(input);

	return file.value as string;

};
