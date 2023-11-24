import type { Writable } from 'svelte/store';

type CustomOption = {
	label: string;
	value: string | number | boolean;
};

type PaginationData = {
	limit: number;
	page: number;
	max: number;
};

type ActionButtonProps = {
	id?:  string | number;
	actionFn: (id: string | number) => void;
};

type ValidateActionButtonProps = {
	id?: number;
	actionFn: (id: number) => void;
	approvedAt: string;
};

type ButtonOption = {
	delete?: ActionButtonProps;
	edit?: ActionButtonProps;
	detail?: ActionButtonProps;
	validate?: ValidateActionButtonProps;
};

type HeaderSorterProps = {
	id: string;
	sorting: 'desc' | 'asc';
	setAscending: () => void;
	setDescending: () => void;
};

type GeoRegionState = {
	provinceID: number;
	regencyID: number;
};

export type {
	CustomOption,
	PaginationData,
	ButtonOption,
	ActionButtonProps,
	HeaderSorterProps,
	GeoRegionState,
	ValidateActionButtonProps
};
