import { page, utils } from "vitest/browser";
import React from "react";
import ReactDOMClient from "react-dom/client";
import { jsx } from "react/jsx-runtime";

//#region src/pure.tsx
const { debug, getElementLocatorSelectors } = utils;
async function act(cb) {
	const _act = React.act || React.unstable_act;
	if (typeof _act !== "function") cb();
	else {
		globalThis.IS_REACT_ACT_ENVIRONMENT = true;
		try {
			await _act(cb);
		} finally {
			globalThis.IS_REACT_ACT_ENVIRONMENT = false;
		}
	}
}
const mountedContainers = /* @__PURE__ */ new Set();
const mountedRootEntries = [];
async function render(ui, { container, baseElement, wrapper: WrapperComponent } = {}) {
	if (!baseElement) baseElement = document.body;
	if (!container) container = baseElement.appendChild(document.createElement("div"));
	let root;
	if (!mountedContainers.has(container)) {
		root = createConcurrentRoot(container);
		mountedRootEntries.push({
			container,
			root
		});
		mountedContainers.add(container);
	} else mountedRootEntries.forEach((rootEntry) => {
		/* istanbul ignore else */
		if (rootEntry.container === container) root = rootEntry.root;
	});
	await act(() => {
		root.render(strictModeIfNeeded(wrapUiIfNeeded(ui, WrapperComponent)));
	});
	return {
		container,
		baseElement,
		locator: page.elementLocator(container),
		debug: (el, maxLength, options) => debug(el, maxLength, options),
		unmount: async () => {
			await act(() => {
				root.unmount();
			});
		},
		rerender: async (newUi) => {
			await act(() => {
				root.render(strictModeIfNeeded(wrapUiIfNeeded(newUi, WrapperComponent)));
			});
		},
		asFragment: () => {
			return document.createRange().createContextualFragment(container.innerHTML);
		},
		...getElementLocatorSelectors(baseElement)
	};
}
async function renderHook(renderCallback, options = {}) {
	const { initialProps,...renderOptions } = options;
	const result = React.createRef();
	function TestComponent({ renderCallbackProps }) {
		const pendingResult = renderCallback(renderCallbackProps);
		React.useEffect(() => {
			result.current = pendingResult;
		});
		return null;
	}
	const { rerender: baseRerender, unmount } = await render(/* @__PURE__ */ jsx(TestComponent, { renderCallbackProps: initialProps }), renderOptions);
	function rerender(rerenderCallbackProps) {
		return baseRerender(/* @__PURE__ */ jsx(TestComponent, { renderCallbackProps: rerenderCallbackProps }));
	}
	return {
		result,
		rerender,
		unmount,
		act
	};
}
async function cleanup() {
	for (const { root, container } of mountedRootEntries) {
		await act(() => {
			root.unmount();
		});
		if (container.parentNode === document.body) document.body.removeChild(container);
	}
	mountedRootEntries.length = 0;
	mountedContainers.clear();
}
function createConcurrentRoot(container) {
	const root = ReactDOMClient.createRoot(container);
	return {
		render(element) {
			root.render(element);
		},
		unmount() {
			root.unmount();
		}
	};
}
const config = { reactStrictMode: false };
function strictModeIfNeeded(innerElement) {
	return config.reactStrictMode ? React.createElement(React.StrictMode, null, innerElement) : innerElement;
}
function wrapUiIfNeeded(innerElement, wrapperComponent) {
	return wrapperComponent ? React.createElement(wrapperComponent, null, innerElement) : innerElement;
}
function configure(customConfig) {
	Object.assign(config, customConfig);
}

//#endregion
export { renderHook as i, configure as n, render as r, cleanup as t };