import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { highlightBrackets } from '../brackets-highlight';

export function highlightTsCode(escapedCode: string): string {
	const highlightedWords = escapedCode.replaceAll(/\b[A-Za-z_]\w*\b/g, word => {
		const color = WORD_COLORS[word];
		return color ? `<span style="color:${color}">${word}</span>` : word;
	});

	return highlightedWords;
}

@Pipe({
	name: 'tsHighlight',
	standalone: true,
})
export class TsHighlightPipe implements PipeTransform {
	private readonly wordColors: Record<string, string> = WORD_COLORS;

	constructor(private readonly sanitizer: DomSanitizer) {}

	transform(value: unknown): SafeHtml {
		if (value == null) return '';

		const text = String(value);

		const highlightedWords = text.replaceAll(/\b[A-Za-z_]\w*\b/g, word => {
			const color = this.wordColors[word];
			return color ? `<span style="color:${color}">${word}</span>` : word;
		});

		const highlighted = highlightBrackets(highlightedWords);

		return this.sanitizer.bypassSecurityTrustHtml(highlighted);
	}
}

const WORD_COLORS: Record<string, string> = {
	// Cyberpunk-ish neon palette (keep it limited + consistent)
	// cyan
	import: '#00E5FF',
	export: '#00E5FF',
	from: '#00E5FF',
	as: '#00E5FF',
	default: '#00E5FF',
	namespace: '#00E5FF',
	module: '#00E5FF',
	declare: '#00E5FF',

	// magenta
	class: '#FF2E88',
	interface: '#FF2E88',
	type: '#FF2E88',
	enum: '#FF2E88',
	function: '#FF2E88',
	constructor: '#FF2E88',
	get: '#FF2E88',
	set: '#FF2E88',

	// violet
	public: '#B026FF',
	protected: '#B026FF',
	private: '#B026FF',
	readonly: '#B026FF',
	abstract: '#B026FF',
	static: '#B026FF',
	override: '#B026FF',
	implements: '#B026FF',
	extends: '#B026FF',
	super: '#B026FF',
	this: '#B026FF',

	// lime/green
	const: '#00FF9C',
	let: '#00FF9C',
	var: '#00FF9C',
	new: '#00FF9C',
	in: '#00FF9C',
	of: '#00FF9C',
	instanceof: '#00FF9C',
	typeof: '#00FF9C',
	keyof: '#00FF9C',
	infer: '#00FF9C',
	is: '#00FF9C',
	asserts: '#00FF9C',

	// amber/yellow
	return: '#FFE66D',
	yield: '#FFE66D',
	await: '#FFE66D',
	async: '#FFE66D',
	if: '#FFE66D',
	else: '#FFE66D',
	switch: '#FFE66D',
	case: '#FFE66D',
	break: '#FFE66D',
	continue: '#FFE66D',
	for: '#FFE66D',
	while: '#FFE66D',
	do: '#FFE66D',
	try: '#FFE66D',
	catch: '#FFE66D',
	finally: '#FFE66D',
	throw: '#FFE66D',

	// orange
	true: '#FF9F1C',
	false: '#FF9F1C',
	null: '#FF9F1C',
	undefined: '#FF9F1C',
	void: '#FF9F1C',
	delete: '#FF9F1C',
	debugger: '#FF9F1C',

	// teal (primitive types)
	string: '#2DE2E6',
	number: '#2DE2E6',
	boolean: '#2DE2E6',
	bigint: '#2DE2E6',
	symbol: '#2DE2E6',
	object: '#2DE2E6',
	any: '#2DE2E6',
	unknown: '#2DE2E6',
	never: '#2DE2E6',

	// blue (common built-ins)
	Promise: '#3D8BFF',
	Array: '#3D8BFF',
	ReadonlyArray: '#3D8BFF',
	Record: '#3D8BFF',
	Map: '#3D8BFF',
	Set: '#3D8BFF',
	Date: '#3D8BFF',
	RegExp: '#3D8BFF',
	Error: '#3D8BFF',
	Function: '#3D8BFF',

	// hot pink (utility types)
	Partial: '#FF2E88',
	Required: '#FF2E88',
	Readonly: '#FF2E88',
	Pick: '#FF2E88',
	Omit: '#FF2E88',
	Exclude: '#FF2E88',
	Extract: '#FF2E88',
	NonNullable: '#FF2E88',
	Parameters: '#FF2E88',
	ReturnType: '#FF2E88',
	InstanceType: '#FF2E88',
	ThisParameterType: '#FF2E88',
	OmitThisParameter: '#FF2E88',
	ConstructorParameters: '#FF2E88',
	Awaited: '#FF2E88',
	Uppercase: '#FF2E88',
	Lowercase: '#FF2E88',
	Capitalize: '#FF2E88',
	Uncapitalize: '#FF2E88',

	// Angular (TypeScript)
	// magenta (decorators / core concepts)
	Component: '#FF2E88',
	Directive: '#FF2E88',
	Pipe: '#FF2E88',
	Injectable: '#FF2E88',
	NgModule: '#FF2E88',

	// violet (DI helpers / tokens)
	inject: '#B026FF',
	Inject: '#B026FF',
	Optional: '#B026FF',
	Self: '#B026FF',
	SkipSelf: '#B026FF',
	Host: '#B026FF',
	forwardRef: '#B026FF',

	// lime/green (signals + standalone helpers)
	signal: '#00FF9C',
	computed: '#00FF9C',
	effect: '#00FF9C',
	input: '#00FF9C',
	output: '#00FF9C',
	model: '#00FF9C',

	// amber/yellow (lifecycle)
	OnInit: '#FFE66D',
	OnDestroy: '#FFE66D',
	OnChanges: '#FFE66D',
	DoCheck: '#FFE66D',
	AfterViewInit: '#FFE66D',
	AfterViewChecked: '#FFE66D',
	AfterContentInit: '#FFE66D',
	AfterContentChecked: '#FFE66D',
	SimpleChanges: '#FFE66D',

	// blue (common Angular types)
	ChangeDetectionStrategy: '#3D8BFF',
	ChangeDetectorRef: '#3D8BFF',
	ElementRef: '#3D8BFF',
	TemplateRef: '#3D8BFF',
	ViewContainerRef: '#3D8BFF',
	Renderer2: '#3D8BFF',
	NgZone: '#3D8BFF',
	DestroyRef: '#3D8BFF',
	DOCUMENT: '#3D8BFF',

	// teal (template bindings / metadata helpers)
	Input: '#2DE2E6',
	Output: '#2DE2E6',
	EventEmitter: '#2DE2E6',
	HostBinding: '#2DE2E6',
	HostListener: '#2DE2E6',
	ViewChild: '#2DE2E6',
	ViewChildren: '#2DE2E6',
	ContentChild: '#2DE2E6',
	ContentChildren: '#2DE2E6',
};
