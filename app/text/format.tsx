"use strict";

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import 'katex/contrib/mhchem';
import rehypeStringify from 'rehype-stringify';


export const processTextToHtml = (input: string): string => {

	const file = unified()
		.use(remarkParse)
		.use(remarkMath)
		.use(remarkRehype)
		.use(rehypeKatex)
		.use(rehypeStringify)
		.processSync(input);

	return file.value as string;

};
